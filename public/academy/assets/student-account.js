/* Accessible Supabase student sign-in. Browser receives only a publishable key. */
(()=>{'use strict';
const root=document.getElementById('academy-account'),cfg=window.OJ_BACKEND_CONFIG||{};
if(!root)return;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(cfg.url)||!cfg.publishableKey){root.textContent='Cloud accounts are not configured yet. You can still use the training studio on this device.';return}
if(!window.supabase?.createClient){root.textContent='Sign-in service could not load. Try refreshing the page; training remains available offline.';return}
const client=window.supabase.createClient(cfg.url,cfg.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const redirect=new URL('cyber-studio.html',location.href).href;
let user=null,mode='signin',busy=false,notice='',noticeError=false;
const button=(id,label)=>'<button type="button" id="'+id+'" class="account-link">'+label+'</button>';
function msg(value,error=false){notice=value;noticeError=error;const el=document.getElementById('account-message');if(el){el.textContent=value;el.className='account-message'+(error?' account-error':'');el.setAttribute('role',error?'alert':'status')}}
function setBusy(value){busy=value;root.querySelectorAll('button,input').forEach(x=>{if(x.id!=='account-show')x.disabled=value})}
function render(){
if(user){root.innerHTML='<div class="account-top"><div><h2>Welcome back</h2><p>Signed in as <strong>'+esc(user.email||'Student')+'</strong></p></div><span class="account-online">Account connected</span></div><div class="account-actions"><button id="account-sync" class="account-primary">Save / sync progress</button><button id="account-logout" class="account-secondary">Sign out</button></div><p class="account-hint">Progress sync is manual. On shared devices, sign out when finished.</p><p id="account-message" class="account-message" role="status"></p>';document.getElementById('account-sync').onclick=sync;document.getElementById('account-logout').onclick=async()=>{setBusy(true);const {error}=await client.auth.signOut();if(error){setBusy(false);msg(error.message,true)}}}
else{const reset=mode==='reset',register=mode==='register',recovery=mode==='recovery';
root.innerHTML='<div class="account-top"><div><h2>'+ (reset?'Reset your password':recovery?'Choose a new password':'Your student account')+'</h2><p>'+(reset?'We will email you a password reset link.':recovery?'Enter a new password to secure your account.':'Sign in to save your learning progress in the cloud.')+'</p></div></div>'+
(!reset&&!recovery?'<div class="account-switch" role="group" aria-label="Account options"><button type="button" id="account-mode-signin" class="'+(!register?'selected':'')+'" aria-pressed="'+(!register)+'">Sign in</button><button type="button" id="account-mode-register" class="'+(register?'selected':'')+'" aria-pressed="'+register+'">Create account</button></div>':'')+
'<form id="account-form" class="account-form">'+(!recovery?'<label for="account-email">Email address</label><input id="account-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required>':'')+
(!reset?'<label for="account-password">'+(recovery?'New password':'Password')+'</label><div class="account-password"><input id="account-password" name="password" type="password" autocomplete="'+(register||recovery?'new-password':'current-password')+'" minlength="'+(register||recovery?10:1)+'" required placeholder="'+(register||recovery?'At least 10 characters':'Your password')+'"><button type="button" id="account-show" aria-label="Show password">Show</button></div>':'')+
'<button type="submit" class="account-primary">'+(reset?'Send reset link':recovery?'Update password':register?'Create my account':'Sign in')+'</button></form>'+
'<div class="account-links">'+(reset?button('account-back','Back to sign in'):recovery?'':button('account-forgot','Forgot password?'))+'</div>'+
'<p class="account-hint">'+(register?'Check your email to confirm your account if prompted. Use an email you can access.':'Never share your password. You can explore the studio without signing in.')+'</p><p id="account-message" class="account-message" role="status"></p>';
const form=document.getElementById('account-form');form.onsubmit=submit;
const signin=document.getElementById('account-mode-signin'),create=document.getElementById('account-mode-register');
if(signin)signin.onclick=()=>{mode='signin';render()};if(create)create.onclick=()=>{mode='register';render()};
const forgot=document.getElementById('account-forgot');if(forgot)forgot.onclick=()=>{mode='reset';render()};
const back=document.getElementById('account-back');if(back)back.onclick=()=>{mode='signin';render()};
const show=document.getElementById('account-show');if(show)show.onclick=()=>{const p=document.getElementById('account-password');p.type=p.type==='password'?'text':'password';show.textContent=p.type==='password'?'Show':'Hide';show.setAttribute('aria-label',p.type==='password'?'Show password':'Hide password')};
}if(notice)msg(notice,noticeError);
}
async function submit(e){e.preventDefault();if(busy)return;const email=document.getElementById('account-email')?.value.trim(),password=document.getElementById('account-password')?.value;const current=mode;setBusy(true);msg('Please wait…');try{
let result;if(current==='register')result=await client.auth.signUp({email,password,options:{emailRedirectTo:redirect}});
else if(current==='reset')result=await client.auth.resetPasswordForEmail(email,{redirectTo:redirect});
else if(current==='recovery')result=await client.auth.updateUser({password});
else result=await client.auth.signInWithPassword({email,password});
if(result.error)throw result.error;
if(current==='register')msg(result.data?.session?'Account created. You are signed in.':'Check your email for a confirmation link, then return here to sign in.');
else if(current==='reset')msg('If an account exists for this email, a reset link will arrive shortly.');
else if(current==='recovery'){mode='signin';msg('Password updated. You can now sign in.');render()}
else msg('Signed in successfully.');
}catch(error){msg(error.message||'Please try again.',true)}finally{setBusy(false)}
}
async function sync(){if(!user||busy)return;setBusy(true);msg('Saving your progress…');try{
const raw=localStorage.getItem('oj-studio-progress');const local=raw?JSON.parse(raw):{completed:{},cases:[],scores:[]};
const {data,error}=await client.from('student_progress').select('progress').eq('user_id',user.id).maybeSingle();if(error)throw error;
const remote=data?.progress||{completed:{},cases:[],scores:[]};
const unique=a=>[...new Map(a.map(x=>[JSON.stringify(x),x])).values()].slice(-100);
const merged={completed:{...(remote.completed||{}),...(local.completed||{})},cases:unique([...(remote.cases||[]),...(local.cases||[])]),scores:unique([...(remote.scores||[]),...(local.scores||[])])};
const saved=await client.from('student_progress').upsert({user_id:user.id,progress:merged,updated_at:new Date().toISOString()},{onConflict:'user_id'});if(saved.error)throw saved.error;
localStorage.setItem('oj-studio-progress',JSON.stringify(merged));msg('Progress saved. Reload the studio to see progress brought in from another device.');
}catch(error){msg('Could not save progress: '+error.message,true)}finally{setBusy(false)}
}
client.auth.onAuthStateChange((event,session)=>{user=session?.user||null;if(event==='PASSWORD_RECOVERY'){mode='recovery';notice='';}else if(event==='SIGNED_OUT'){mode='signin';notice='';}render()});
client.auth.getSession().then(({data,error})=>{if(error)throw error;user=data.session?.user||null;render()}).catch(()=>{root.textContent='Could not connect to accounts. Training is still available offline.'});
})();
