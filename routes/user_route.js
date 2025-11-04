var express=require("express");
var exe=require("./../connection");
var url=require("url");
var router=express.Router();
router.get("/",async function(req,res){
    var home_info=await exe(`select * from home_info`);
    var obj={"home_info":home_info[0]}
    res.render("user/home.ejs",obj);
});
// router.get("/about",async function(req,res){
//     var home_info=await exe(`select * from home_info`);
//     var personal_info=await exe(`select * from personal_info`);
//     var obj={"home_info":home_info[0],"personal_info":personal_info[0]}
//     res.render("user/about.ejs",obj);
// });
// router.get("/resume",async function(req,res){
//     var home_info=await exe(`select * from home_info`);
//     var obj={"home_info":home_info[0]}
//     res.render("user/resume.ejs",obj);
// });
// router.get("/contact",async function(req,res){
//     var home_info=await exe(`select * from home_info`);
//     var personal_info=await exe(`select * from personal_info`);
//     var obj={"home_info":home_info[0],"personal_info":personal_info[0]}
//     res.render("user/contact.ejs",obj);
// });
// Contact form route
router.post("/contact_now", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).send("All fields are required.");
    }

    // Get current date and time
    const now = new Date();
    const date = now.toISOString().slice(0, 10).split("-").reverse().join("-"); // dd-mm-yyyy
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    // Parameterized query to prevent SQL injection
    const sql = `
      INSERT INTO student_info (name, email, subject, message, date, time, min)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [name, email, subject, message, date, hours, minutes];

    await exe(sql, params);

    // Redirect to homepage or contact page after successful insert
    res.render("user/home.ejs");

  } catch (error) {
    console.error("❌ Error inserting contact form data:", error);
    res.status(500).send("An error occurred while submitting the form.");
  }
});


// router.get("/portfolio",async function(req,res){
//     var home_info=await exe(`select * from home_info`);
//     var obj={"home_info":home_info[0]}
//     res.render("user/portfolio.ejs",obj);
// });
router.post("/admin_login",async function(req,res){
    var d=req.body;
    var sql=`select * from admin_login where email='${d.email}' AND password='${d.password}'`;
    var data=await exe(sql);
    if(data.length>0)
    {
        req.session['admin_id']=data[0].admin_id;
        res.redirect("/admin/");
    }else
    {
        res.redirect("/admin/login");
    }

});
router.get("/logout_admin",function (req,res){
    if(req.session.admin_id==req.session.admin_id){
        res.redirect("/admin/login");
    }
})

module.exports=router;

