const express = require('express');
const multer = require('multer');
const path = require('path');
const aws = require('aws-sdk'); // aws 설정을 위한 모듈
const multerS3 = require('multer-s3'); // aws s3에 업로드하기 위한 multer설정
const app = express();
const PORT = 8000;


// view engine
app.set('view engine', 'ejs');
app.set('views', './views');
// bady paser
app.use(express.urlencoded({extended:true}));
app.use(express.json());
// 정적파일 생성
app.use('/uploads', express.static(__dirname + '/uploads'));

//multer 설정
// const storage = multer.diskStorage({
//     destination : (req,file,cb) => {
//         cb(null, './uploads/');
//     },
//     filename : (req, file, cb) => {
//         //파일 확장자 추출
//         const ext = path.extname(file.originalname);
//         // 파일 이름 추출
//         const newName = path.basename(file.originalname, ext) + Date.now() + ext;
//         cb(null, newName);
//     }
// })
// const upload = multer({storage});


// aws 설정
aws.config.update({
    accessKeyId : 'AKIA6GQIYR7AT3DGOSF6',
    secretAccessKey : "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",
    region: 'ap-northeast-2'
})
// aws s3 인스턴스 생성
const s3 = new aws.S3();
// multer 설정 - aws
const upload = multer({
    storage : multerS3({
        s3: s3, // s3 인스턴스
        bucket : 'kdt9-justin', // 버킷 name
        acl : 'public-read', // 파일 접근권한 (public-read로 해야 업로드 파일 공개)
        metadata : function(req,file, cb) {
            cb(null, {fieldname : file.fieldname});
        },

        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname);
        }
    })
})



app.get('/' ,(req,res) => {
    res.render('index'); 
})

app.post('/upload/array', upload.array('files'), (req, res) => {
    console.log(req.files);
    res.send({
        files: req.files
    });
})

app.use( '*' , (req, res) => {
    res.render('404');
})

app.listen(PORT, () => {
    console.log(`localhost:${PORT}`);
})