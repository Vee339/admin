// Importing the required modules
const express = require("express");
const path = require("path");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const dotenv = require("dotenv");

//load the environment variables from .env
dotenv.config();

// Connect to the database
const dbUrl = process.env.DBHOST;
const client = new MongoClient(dbUrl);

// Set up the express app
const app = express();
const port = process.env.PORT || "8888";

// Set up template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Set up folder for the static files such as (CSS, client-side Js)
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);
// main page
app.get("/admin", async (req, res) => {
  res.render("index", { title: "Home" });
});

// get projects
app.get("/admin/projects", async (req, res) => {
  const projectsList = await getProjects();
  res.render("projects/projects", {
    title: "Projects",
    projects: projectsList,
  });
});

// find details of a particular project
app.get("/admin/projects/project/:id", async (req, res) => {
  const projectDetails = await getProjectDetails(req.params.id);
  res.render("projects/project", {
    title: projectDetails.name,
    project: projectDetails,
  });
});

// add a new project
app.get("/admin/projects/add", async (req, res) => {
  res.render("projects/add-project", { title: "Add new project" });
});

// submit the new project
app.post("/admin/projects/add/submit", async (req, res) => {
  const project = req.body;
  const newProject = {
    name: project.project_name,
    description: project.description,
    url: project.url,
    thumbnail: project.thumbnail,
    skills: project.skills,
  };
  await addProject(newProject);
  res.redirect("/admin/projects");
});

// delete a project
app.get("/admin/projects/delete/:id", async (req, res) => {
  await deleteProject(req.params.id);
  res.redirect("/admin/projects");
});

// api to retrieve the projects
app.get("/api/projects", async (req, res) => {
  const projects = await getProjects();
  res.json(projects);
});

// get the list of skills
app.get("/admin/skills", async (req, res) => {
  const skillsList = await getSkills();
  // res.send(skillsList);
  res.render("skills/skills", { title: "Skills", skills: skillsList });
});

// get the information about a particular skill
app.get("/admin/skills/skill/:id", async (req, res) => {
  const skillInfo = await getSkillDetails(req.params.id);
  // res.send(skillInfo);
  res.render("skills/skill", { title: skillInfo.name, skill: skillInfo });
});

// Displaying the page for adding a new skill
app.get("/admin/skills/add", async (req, res) => {
  res.render("skills/add", { title: "Add Skill" });
});

// Submitting a new skill
app.post("/admin/skills/add/submit", async (req, res) => {
  const skill = req.body;
  const newSkill = {
    name: skill.skill_name,
    category: skill.category,
    proficiency: skill.proficiency_level,
    icon: skill.icon_image,
  };
  await addSkill(newSkill);
  res.redirect("/admin/skills");
});

// Delete a skill from the database
app.get("/admin/skills/delete/:id", async (req, res) => {
  await deleteSkill(req.params.id);
  res.redirect("/admin/skills");
});

// Set up the server listening
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/admin`);
});

// MongoDb helper function
async function connect() {
  db = client.db("my_portfolio");
  return db;
}

async function getProjects() {
  db = await connect();
  let results = db.collection("projects").find({});
  let resultsArray = await results.toArray();
  return resultsArray;
}

async function getProjectDetails(projectId) {
  db = await connect();
  const result = db
    .collection("projects")
    .findOne({ _id: new ObjectId(projectId) });
  return result;
}

async function addProject(project) {
  db = await connect();
  await db.collection("projects").insertOne(project);
}

async function deleteProject(projectId) {
  db = await connect();
  await db.collection("projects").deleteOne({ _id: new ObjectId(projectId) });
}

async function getSkills() {
  db = await connect();
  const results = db.collection("skills").find({});
  const resultArray = await results.toArray();
  return resultArray;
}

async function getSkillDetails(skillId) {
  db = await connect();
  const result = db
    .collection("skills")
    .findOne({ _id: new ObjectId(skillId) });
  return result;
}

async function addSkill(skill) {
  db = await connect();
  await db.collection("skills").insertOne(skill);
}

async function deleteSkill(skillId) {
  db = await connect();
  await db.collection("skills").deleteOne({ _id: new ObjectId(skillId) });
}
