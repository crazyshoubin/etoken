var express = require('express');
var router = express.Router();
var connection = require('../sqlconfig.js');
var formidable = require('formidable');
var ETOKEN_ICO = 'ETOKEN_ICO';
var multiparty = require('multiparty');
var fs = require('fs')
//all info 获取
router.all('/ico/allinfo', function(req, res, next){

    if (req.method == "POST") {
        var param = req.body;
    } else{
        var param = req.query || req.params;
    }

    connection.query('SELECT * FROM '+ETOKEN_ICO,function (err, results){
        res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
        if (err){
            res.end(JSON.stringify({status:'500',msg:err}));
        }else{
            // 数据库存在
            if (results.length == 0) {
                res.end(JSON.stringify({status:'500',msg:'没有这条信息'}));
            } else{
                res.end(JSON.stringify({status:'200',msg:'获取数据成功',data:results}));
            }
        }
    })
});
// 信息输出根据id
router.all('/ico/info', function(req, res, next){

    if (req.method == "POST") {
        var param = req.body;
    } else{
        var param = req.query || req.params;
    }
    var id = param.id;
    connection.query('SELECT * FROM '+ETOKEN_ICO +' WHERE ICO_ID='+id,function (err, results){
        res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
        if (err){
            res.end(JSON.stringify({status:'500',msg:err}));
        }else{
            // 数据库存在
            if (results.length == 0) {
                res.end(JSON.stringify({status:'500',msg:'没有这条信息'}));
            } else{
                res.end(JSON.stringify({status:'200',msg:'获取数据成功',data:results}));
            }
        }
    })
});
//添加ico
router.all('/ico/addinfo', function(req, res, next){
    if (req.method == "POST") {
        var param = req.body;
    } else{
        var param = req.query || req.params;
    }

    connection.query('SELECT * FROM ETOKEN_ICO  WHERE ICO_Name = ?',[param.ICO_Name],function (err, results){
        if (err){
            res.end(JSON.stringify({status:'500',msg:err,data:"查询错误"}));
        }else{
            // 数据库存在
            if (results.length == 0) {
                connection.query('INSERT INTO ETOKEN_ICO(ICO_Name,ICO_URL,ICO_Score,ICO_ICON,ICO_Basis,ICO_Founding,ICO_Total,ICO_StartTime,ICO_Amount,ICO_State,' +
                    'ICO_Logo,ICO_Country,ICO_Exchange,ICO_Team,ICO_Wpaper,ICO_Remark,ICO_Type,ICO_EndTime,ICO_HOT) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                    [param.ICO_Name,param.ICO_URL,param.ICO_Score,param.ICO_ICON,
                    param.ICO_Basis,param.ICO_Founding,param.ICO_Total,param.ICO_StartTime,param.ICO_Amount,
                    param.ICO_State,param.ICO_Logo,param.ICO_Country,param.ICO_Exchange,param.ICO_Team,param.ICO_Wpaper,
                    param.ICO_Remark,param.ICO_Type,param.ICO_EndTime,param.ICO_HOT],function (err, results){
                    res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
                    if (err){
                        res.end(JSON.stringify({status:'500',msg:err,data:param.ICO_URL}));
                    }else{
                        res.end(JSON.stringify({status:'200',msg:'添加成功!'}));
                    }
                })
            } else{
                res.end(JSON.stringify({status:'500',msg:'该项目已存在'}));

            }
        }
    })

});
//上传文件
router.all('/ico/updatafile', function (req, res){
    var form = new multiparty.Form({uploadDir: './public/upload'});
    form.on('error', function(err) {
        console.log('Error parsing form: ' + err.stack);
    });
    form.parse(req, function (err, fields, files){
        var filesTmp = JSON.stringify(files,null,2);
        if (err){
            res.send(JSON.stringify({status:'500',msg:err,data:"写文件操作失败。"}));
        }else {
            res.send(JSON.stringify({status:'200',msg:"文件上传成功"}));
            var fileNameArr = Object.keys(files);
            var firstFilename = fileNameArr[0];
            var fileDataArr = files[firstFilename];
            var fileData = fileDataArr[0];
            var uploadedPath = fileData.path;
            var dstPath = './public/upload/' + fileData.originalFilename;
            fs.rename(uploadedPath, dstPath, function(err) {
                if (err){
                    console.log("重命名文件错误："+ err);
                } else {
                    console.log("重命名文件成功。");
                }
            });
        }
    });
});
//更新ico数据
router.all('/ico/updatainfo', function(req, res, next){

    if (req.method == "POST") {
        var param = req.body;
    } else{
        var param = req.query || req.params;
    }
        connection.query('UPDATE  ETOKEN_ICO SET ICO_URL=?,ICO_Score=?,ICO_ICON=?,ICO_Basis=?,' +
            'ICO_Founding=?,ICO_Total=?,ICO_StartTime=?,ICO_Amount=?,ICO_State=?,ICO_Logo=?,' +
            'ICO_Country=?,ICO_Exchange=?,ICO_Team=?,ICO_Wpaper=?,ICO_Remark=?,ICO_Type=?,' +
            'ICO_EndTime=?,ICO_HOT=? WHERE ICO_Name=?',[param.ICO_URL,param.ICO_Score,param.ICO_ICON,
            param.ICO_Basis,param.ICO_Founding,param.ICO_Total,param.ICO_StartTime,param.ICO_Amount,
            param.ICO_State,param.ICO_Logo,param.ICO_Country,param.ICO_Exchange,param.ICO_Team,param.ICO_Wpaper,
            param.ICO_Remark,param.ICO_Type,param.ICO_EndTime,param.ICO_HOT,param.ICO_Name],function (err, results){
            res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
            if (err){
                res.end(JSON.stringify({status:'500',msg:err}));
            }else{
                res.end(JSON.stringify({status:'200',msg:'修改成功!'}));
            }
        })

});
//用户注册
router.all('/ico/register', function(req, res, next){
    if (req.method == "POST") {
        var param = req.body;
    } else{
        var param = req.query || req.params;
    }
    connection.query('SELECT * FROM ETOKEN_USER  WHERE Phone = ?',[param.phone],function (err, results){
        res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
        if (err){
            res.end(JSON.stringify({status:'501',msg:err}));
        }else{
            // 数据库不存在 就注册成功
            if (results.length == 0) {
                // 把新用户插入数据库
                var crypto = require('crypto');
                var md5 = crypto.createHash("md5");
                var end_paw= md5.update(param.pass).digest('hex');
                connection.query('INSERT INTO ETOKEN_USER(Phone,Pass,Date) VALUES(?,?,?)',[param.phone,end_paw,new Date()],function (err, results) {
                    if(err){
                        res.end(JSON.stringify({status:'500',msg:err+1}));
                    }else{
                        res.end(JSON.stringify({status:'200',msg:'注册成功!'}));
                    }
                })
            } else{ // 数据库存在就注册失败
                res.end(JSON.stringify({status:'500',msg:'该用户名已经被注册'}));
            }
        }
    })
});
// 登录接口
router.all('/ico/login', function(req, res, next){
    if (req.method == "POST") {
        var param = req.body;
    } else{
        var param = req.query || req.params;
    }
    var crypto = require('crypto');
    var md5 = crypto.createHash("md5");
    var end_paw= md5.update(param.pass).digest('hex')
    connection.query('SELECT * FROM ETOKEN_USER  WHERE Phone = ? AND Pass = ?',[param.phone,end_paw],function (err, results){
        res.writeHead(200,{'Content-Type':'application/json;charset=utf-8'});
        if (err){
            res.end(JSON.stringify({status:'500',msg:err}));
        }else{
            // 数据库存在

            //res.signedCookies('cart', { items: [1,2,3] }, { maxAge: 900000 });
            if (results.length == 0) {
                res.end(JSON.stringify({status:'500',msg:'用户名或密码错误'}));
            } else{
                req.session.regenerate(function(err) {
                    if(err){
                        return res.end(JSON.stringify({status: 500, ret_msg: '登录失败'}));
                    }
                    if(param.type){
                        var long=604800*1000;
                        req.session.cookie.expires=new Date(Date.now()+long);
                        req.session.cookie.maxAge=long;
                    }
                    req.session.user = {'username':param.phone};
                    res.end(JSON.stringify({status: 200, msg: '登录成功'}));
                });

            }
        }
    })
});
module.exports = router;
