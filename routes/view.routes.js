const { createViewPage } = require("../helpers/create_view_page");
const Dictionary = require("../schemas/Dictionary");
const Topic = require("../schemas/Topic");
const Author = require("../schemas/Author");
const { errorHandler } = require("../helpers/error_handler");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.render(createViewPage("index"), {
    title: "Asosiy sahifa",
    isHome: true,
  });
});

router.get("/dictionary", async (req, res) => {
  try {
    const terms = JSON.parse(JSON.stringify(await Dictionary.find()));

    // console.log(terms);

    // const termsForClient = terms.map((t) => ({
    //   ...t.toObject(),
    //   id: t._id.toString(),
    // }));
    // ChatGPT shuni chiqarib berdi 👆, keyin kalla ishlab ketib qoldi,
    // mongoose json qaytarardi, shunga termsni parse qildim, o'xshamadi,
    // keyin birinchi stringify qildimda keyin parse qildim, shunda o'xshadi.

    res.render(createViewPage("dictionary"), {
      title: "Lug'atlar",
      isDict: true,
      terms,
    });
  } catch (err) {
    console.error("Error fetching terms:", err);
    errorHandler(err, res);
  }
});

router.get("/topics", async (req, res) => {
  try {
    const topics = JSON.parse(
      JSON.stringify(
        await Topic.find().populate(
          "author_id",
          "author_first_name author_last_name author_nick_name"
        )
      )
    );
    console.log(topics);

    res.render(createViewPage("topics"), {
      title: "Maqolalar",
      isTopic: true,
      topics,
    });
  } catch (err) {
    errorHandler(err, res);
  }
});

router.get("/authors", (req, res) => {
  res.render(createViewPage("authors"), {
    title: "Mualliflar",
    isAuthor: true,
  });
});

router.get("/login", (req, res) => {
  res.render(createViewPage("login"), {
    title: "Kirish",
    isAuthor: true,
  });
});

router.get("/authorreg", (req, res) => {
  res.render(createViewPage("authorreg"), {
    title: "Authorlikga ro'yxatdan o'tish",
    isAuthorReg: true,
  });
});

router.get("/adminlogin", (req, res) => {
  res.render(createViewPage("adminlogin"), {
    title: "Admin Login",
    isAdminLogin: true,
  });
});

router.get("/admin/dashboard", (req, res) => {
  res.render(createViewPage("admin_dashboard"), {
    title: "Admin Dashboard",
    isAdminDashboard: true,
  });
});

module.exports = router;
