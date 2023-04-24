const router=require('express').Router()
const multer=require('multer')
const path=require('path')
const File = require('../models/file')
const {v4:uuid4}= require('uuid')


//basic config for multer
let storage=multer.diskStorage({
    destination: (req,file,callBack)=> callBack(null,'uploads/'),
    filename:(req,file,callBack)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
        callBack(null,uniqueName);
    },
})

let upload = multer({   
    storage: storage,
    limits: {fileSize:1000000*100}   //100mb
}).single('myfile')   
//done


router.post('/',(req,res)=>{
    
    //store file (using multer)
    upload.single(req,res,async(err)=>{
         //validate req
        if(!req.file){         //used to check whether we are getting a file or not through multer
            return res.json({error:'all fields are required.'})
        }
        if(err){
            res.status(500).send({error:err.message})
        }
        //store to database
        const file=new File({
            filename: req.file.filename,
            uuid:uuid4(),
            path:req.file.path,
            size:req.file.size
        })
        const response= await file.save()
        return res.json({ file: `${process.env.APP_BASE_URL}/files/${file.uuid}`}) //url will be like http://localhost:3000/files/uuid
         
    })

    //generate response ie download link

})

router.post('/send',async(req,res)=>{
    //validate request
    const {uuid,emailTo,emailFrom}= req.body
    if(!uuid||!emailTo||!emailFrom){
        return res.send({error:'All fields are required'})
    }
    //get data from db
    const file=await File.findOne({uuid:uuid})
    if(file.sender){
        return res.send({error:'Email already sent'})
    }
    file.sender=emailFrom
    file.receiver=emailTo
    const response=await file.save()
    
    //send email
    let sendMail=require('../services/emailService')
    sendMail(
        emailFrom,
        emailTo,
        'File shared through app created by Aditya Sugandhi',
        `${emailFrom} shared a file with you`,
        `<h1>Download the file using the link</h1><p>${process.env.APP_BASE_URL}/files/${file.uuid}</p>`
    )
    return res.send({success:true})
})

module.exports=router;
