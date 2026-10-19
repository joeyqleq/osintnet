'use strict';
document.querySelector('#key-file').addEventListener('change',async event=>{
  const file=event.target.files[0],error=document.querySelector('#file-error');
  error.textContent='';
  if(!file)return;
  try{
    if(file.size>256)throw Error('Choose the small operator key file.');
    const value=(await file.text()).trim();
    if(!/^[A-Za-z0-9_-]{32,128}$/.test(value))throw Error('This file does not contain an operator key.');
    document.querySelector('#key').value=value;
    error.textContent='Key ready. Open the workspace to sign in.';
  }catch(e){error.textContent=e.message;}
  event.target.value='';
});
