const dropZone= document.querySelector(".drop-zone");
const browseBtn=document.querySelector(".browseBtn");
const fileInput=document.querySelector("#fileinput");
const bgProgress=document.querySelector(".bg-progress");
const percentDiv=document.querySelector("#percent");
const progressBar=document.querySelector(".progress-bar");
const progressContainer=document.querySelector(".progress-container");
const fileURL=document.querySelector("#fileURL");
const sharingContainer=document.querySelector(".sharing-container");
const copyBtn=document.querySelector("#copyBtn");
const emailForm=document.querySelector(".form-container");
const toast=document.querySelector(".toast");
const maxAllowedSize=100*1024*1024;

const host="http://localhost:3000/";
const uploadURL= host + "api/files";
const emailURL=host + "api/files/send";

let toastTimer;

const showToast=(msg)=>{
  toast.innerText=msg;
  toast.style.transform ="translateY(-50%,0)";
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>{
    toast.style.transform ="translateY(-50%,60px)";
  },20000);
};

dropZone.addEventListener("dragover",function(e){ 
  e.preventDefault();
  if(!(dropZone.classList.contains("dragged"))){
    dropZone.classList.add("dragged");
  }
});

dropZone.addEventListener("dragleave",function(){ 
  dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop",function(e){
  e.preventDefault();
  dropZone.classList.remove("dragged");
  const files=e.dataTransfer.files[0];
  uploadFile(files);
   if(files.length){
     fileInput.files=files;
   }
});

browseBtn.addEventListener("click",function(){ 
  fileInput.click();
});

fileInput.addEventListener("change",function(){
  var file = fileInput.files[0];
  uploadFile(file);
 
});

copyBtn.addEventListener("click",function(){
  fileURL.select();
  document.execCommand("copy");
  showToast("Link copied");
});


const uploadFile= (filevar) =>{

  if(fileInput.files.length>1){
    showToast("only upload one file");
    return;
  }
  const file= filevar;
  if(file.size>maxAllowedSize){
    console.log("Only upload less than 100MB")
  }
  const formData = new FormData();
  formData.append("myfile",file);
  progressContainer.style.display = "block";

  const xhr=new XMLHttpRequest();
  xhr.onreadystatechange = ()=>{
    if(xhr.readyState===XMLHttpRequest.DONE){
      onUploadSuccess(JSON.parse(xhr.response));
    }
  };
 
  xhr.upload.onprogress=updateProgress;
  xhr.open("POST",uploadURL);
  xhr.send(formData);
};

const updateProgress=(e) =>{
  const percent=Math.round((e.loaded/e.total)*100);
  percentDiv.innerText=percent;
  bgProgress.style.width=percent+"%";
  progressBar.style.transform="scaleX("+percent/100+")";
  bgProgress.style.transform = "scaleX("+percent/100+")";
}

const onUploadSuccess=({file:url})=>{
fileInput.value="";
emailForm[2].removeAttribute("disabled");
emailForm[2].innerText = "Send";
progressContainer.style.display = "none"; 
sharingContainer.style.display="block";
fileURL.value=url;
}

emailForm.addEventListener("submit",function(e){
  e.preventDefault();
  const url=fileURL.value;

  const formData={
    uuid:url.split("/").splice(-1,1)[0],
    emailTo:emailForm.elements["to-email"].value,
    emailFrom:emailForm.elements["from-email"].value,
  };
  
  emailForm[2].setAttribute("disabled","true");
  emailForm[2].innerText = "Sending";
  const xhr=new XMLHttpRequest();
  xhr.open("POST",emailURL);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send((JSON.stringify(formData)));
  emailForm[2].setAttribute("disabled","true");
  emailForm[2].innerText = "Send";
});
