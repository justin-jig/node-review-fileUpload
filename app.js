const express = require('express');
const multer = require('multer');
const path = require('path');

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
const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null, './uploads/');
    },
    filename : (req, file, cb) => {
        //파일 확장자 추출
        const ext = path.extname(file.originalname);
        // 파일 이름 추출
        const newName = path.basename(file.originalname, ext) + Date.now() + ext;
        cb(null, newName);
    }
})
const limits = {
    fileSize : 5 * 1024 * 1024 //5mb
}
const upload = multer({storage, limits});


app.get('/' ,(req,res) => {
    console.log(req.files);
    res.render('index'); 
})

app.post('/upload/array', upload.array('files'), (req, res) => {
    console.log();
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