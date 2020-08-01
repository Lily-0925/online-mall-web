var express = require('express');
var router = express.Router();
require('./../util/util')
var User = require('./../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test', function(req, res, next) {
  res.send('test');
});

router.post("/login", function (req,res,next) {
  var param = {
      userName:req.body.userName,
      userPwd:req.body.userPwd
  }
  User.findOne(param, function (err,doc) {
      if(err){
          res.json({
              status:"1",
              msg:err.message
          });
      }else{
          if(doc){
              res.cookie("userId",doc.userId,{
                path:'/',
                maxAge:1000*60*60
              });
              res.cookie("userName",doc.userName,{
                path:'/',
                maxAge:1000*60*60
              });
              //req.session.user = doc;
              res.json({
                  status:'0',
                  msg:'',
                  result:{
                      userName:doc.userName
                  }
              });
          }
      }
  });
});

router.post('/logout',function(req,res,next){
    res.cookie('userId','',{
        'path':"/",
        'maxAge':-1
    });
    res.json({
        status:"0",
        msg:'',
        result:""
    })
});

router.get('/checkLogin',function(req,res,next){
        if(req.cookies.userName){
            res.json({
                status:'0',
                msg:'',
                result:req.cookies.userName
            })
        }else{
            res.json({
                status:'1',
                msg:'用户未登录',
                result:''
            })
        }
});

//获取当前用户的购物车
router.get("/cartList",function(req,res,next){
        var userId = req.cookies.userId;
        User.findOne({userId:userId},function(err,userdoc){
            if(err){
                res.json({
                    status:"1",
                    msg:err.message,
                    result:''
                });
            }else{
                if(userdoc){
                    res.json({
                        status:"0",
                        msg:'',
                        result:userdoc.cartList
                    });
                }
            }
        })
});

//购物车删除
router.post('/cartDel',function(req,res,next){
    var productId = req.body.productId;
    var userId = req.cookies.userId
    User.update({userId:userId},{$pull:{'cartList':{'productId':productId}}},function(err,userdoc){
        if(err){
            res.json({
                status:"1",
                msg:err.message,
                result:''
            });
        }else{
            if(userdoc){
            res.json({
                status:"0",
                msg:'',
                result:'suc'
            });
        }
        }
    })
});

//修改购物车
router.post('/cartEdit',function(req,res,next){
    var userId = req.cookies.userId,
        productId=req.body.productId,
        productNum=req.body.productNum,
        checked = req.body.checked;
    User.update({"userId":userId, "cartList.productId":productId},{
        "cartList.$.productNum":productNum,
        "cartList.$.checked":checked
    }),function(err,userdoc){
        if(err){
            res.json({
                status:"1",
                msg:err.message,
                result:''
            });
        }else{
            if(userdoc){
            res.json({
                status:"0",
                msg:'',
                result:'suc'
            });
        }
        }

    }
});

//当全部选中时，修改购物车
router.post('/checkCart',function(req,res,next){
    var userId = req.cookies.userId
        checkedAll = req.body.CheckAllFlag?'1':'0'
    User.findOne({userId:userId},function(err,userdoc){
        if(err){
            res.json({
                status:"1",
                msg:err.message,
                result:''
            });
        }else{
            if(userdoc){
                userdoc.cartList.forEach((item)=>{
                    item.checked=checkedAll;
                });
                userdoc.save(function(err,doc){
                    if(err){
                        res.json({
                            status:"1",
                            msg:err.message,
                            result:''
                        });
                    }else{
                        res.json({
                        status:"0",
                        msg:'',
                        result:'suc'
                    });
                }
                })
            
        }
        }

    })
})

//提取用户的地址
router.get('address',function(req,res,next){
    userId=req.cookies.userId;
    User.findOne({userId:userId},function(err,userdoc){
        if(err){
            res.json({
                status:'1',
                msg:err.message,
                result:''
            })
        }else{
            res.json({
                status:'0',
                msg:'',
                result:userdoc.addressList
            })
        }
    })
})

//设置默认地址
router.post('/setDefaultAddress',function(req,res,next){
    var userId = req.cookies.userId,
        addressId = req.body.addressId
    User.findOne({userId:userId},function(err,userdoc){
        if(err){
            res.json({
                status:'1',
                msg:err.message,
                result:''
            })
        }else{
            addressList=userdoc.addressList;
            addressList.forEach((item)=>{
                    if(item.addressId==addressId){
                        item.isDefault=true;
                    }else{
                        item.isDefault=false;   
                    }
            });
            userdoc.save(function(err1,doc){
                if(err1){
                    res.json({
                        status:'1',
                        msg:err1.message,
                        result:''
                    })
                }else{
                    res.json({
                        status:'0',
                        msg:'',
                        result:''
                    })
                }
            })

        }
    })
})

//删除地址
router.post('/delAddress',function(req,res,next){
    var userId=req.cookies.userId,
        addressId=req.body.addressId;
    User.update({userId:userId},{$pull:{addressList:{addressId:addressId}}},function(err,userdoc){
        if(err){
            res.json({
                status:'1',
                msg:err.message,
                result:''
            })
        }else{
            res.json({
                status:'0',
                msg:'',
                result:'succ'
            })
        }
    })
})

//订单确认
router.post('/payment',function(req,res,next){
    var userId=req.cookies.userId,
        priceTotal=req.body.priceTotal,
        addressId=req.body.addressId;
    User.findOne({userId:userId},function(err,userdoc){
        if(err){
            res.json({
                status:'1',
                msg:err.message,
                result:''
            })
        }else{
            //获取当前用户地址信息
            var address='',goodsList=[];
            userdoc.addressList.forEach((item)=>{
                if(item.addressId==addressId){
                    address=item;
                }
            });
            //获取用户购物车的购买商品
            userdoc.cartList.forEach((item)=>{
                if(item.checked=='1'){
                    goodsList.push(item);
                }
            });
            var random_num='2333';
            var r1=Math.float(Math.random()*10);
            var r2=Math.float(Math.random()*10);
            var sysDate = new Date().Formate('yyyyMMddhhmmss');
            var createDate=new Date().Formate('yyyy-MM-dd hh:mm:ss');
            var orderId=sysDate+r1+random_num+r2;
            var order={
                orderId:orderId,
                orderTotal:priceTotal,
                addressInfo:address,
                goodsList:goodsList,
                orderStatus:'1',
                createDate:createDate
            };
            userdoc.orderList.push(order);
            userdoc.save(function(err1,doc1){
                if(err1){
                    res.json({
                        status:'1',
                        msg:err.message,
                        result:''
                    })
                }else{
                    res.json({
                        status:'0',
                        msg:'',
                        result:{
                            orderId:order.orderId,
                            orderTotal:order.orderTotal 
                        }
                    })
                }
            })
            
        }
    })
})

//通过orderid查询订单总金额
router.get('/orderDetail',function(req,res,next){
    var userId=req.cookies.userId,
        orderId=req.param("orderId");
    User.findOne({userId:userId},function(err,userdoc){
        if(err){
            res.json({
                status:'1',
                msg:err.message,
                result:''
            })
        }else{
            var orderTotal=0;
            userdoc.orderList.forEach((item)=>{
                if(item.orderId==orderId){
                    orderTotal=item.orderTotal
                }
            });
            res.json({
                status:'0',
                msg:'',
                result:{
                    orderTotal:orderTotal
                }
            })
        }
    })
});

//获得购物车的数量
router.get('/getCartCount',function(req,res,next){
    if(req.cookies&&req.cookies.userId){
        var userId=req.cookies.userId;
        User.findOne({userId:userId},function(err,userdoc){
            if(err){
                res.json({
                    status:'1',
                    msg:err.message,
                    result:''
                })
            }else{
                var cartList=userdoc.cartList;
                let cartCount = 0;
                cartList.forEach((item)=>{
                    cartCount+=parseInt(item.productNum);
                });
                res.json({
                    status:'0',
                    msg:'',
                    status:cartCount
                })
            }
        })
    }
})
module.exports = router;
