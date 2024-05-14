const jwt = require("jsonwebtoken");
const xlsx = require("xlsx");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const users = require("../commanFunctions/users")
require('dotenv').config();

module.exports = {
  login: async (req, res) => {
   

    const { username } = req.body;

    let findUser = users.find((value) => value.username === username);
    if (!findUser) {
      res.send({ message: "User Not Found" }).status(404);
    }

    const accessToken = jwt.sign(
      findUser,
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res
      .send({ message: "LogIn Successfull", user: username ,role:findUser.role, accessToken: accessToken})
      .status(200);
  },

  home: async (req, res) => {
    let sheetData_response1 = module.exports.readFile(
      "./cvsFiles/adminUser.csv"
    );
    let sheetData_response2 = module.exports.readFile(
      "./cvsFiles/regularUser.csv"
    );

    if (req.user.ADMIN === true) {
      res.status(200).send([...sheetData_response1, ...sheetData_response2]);
    } else {
      res.status(200).send([...sheetData_response2]);
    }
  },

  addBook: async (req, res) => {
    if (!req.user.ADMIN) {
      res.send({ message: "Access Denied" });
    }
    const { BookName, Author, PublicationYear } = req.body;
    if (!BookName || !Author || !PublicationYear) {
      res.status(500).send({ message: "Missing required fields" });
      return;
    }
    if (
      !(
        typeof BookName === "string" &&
        typeof PublicationYear === "number" &&
        typeof Author === "string"
      )
    ) {
      res.status(500).send({ message: "Type is MisMatching" });
      return;
    }

    let sheetData_response2 = module.exports.readFile(
      "./cvsFiles/regularUser.csv"
    );
    sheetData_response2.push({
      "Book Name": BookName.toLowerCase(),
      Author: Author,
      "Publication Year": PublicationYear,
    });
    const csvWriter = createCsvWriter({
      path: "./cvsFiles/regularUser.csv",
      header: [
        { id: "Book Name", title: "Book Name" },
        { id: "Author", title: "Author" },
        { id: "Publication Year", title: "Publication Year" },
      ],
    });
    try {
      await csvWriter
        .writeRecords(sheetData_response2)
        .then(async () => {
          console.log("file write succesfully");
          res
            .status(200)
            .send({
              message: "Book Adedd Successuflly",
              Books: sheetData_response2,
            });
        })
        .catch((err) => {
          res.status(500).send({ message: err });
        });
    } catch (err) {
      console.error("Error writing CSV file:", err);
    }
  },

  deleteBook: async (req, res) => {
    if (!req.user.ADMIN) {
      res.send({ message: "Access Denied" });
    }
    const { BookName } = req.body;
    if (!BookName) {
      res.status(500).send({ message: "Missing required fields" });
      return;
    }
    if (!(typeof BookName === "string")) {
      res.status(500).send({ message: "Type is MisMatching" });
      return;
    }

    let sheetData_response2 = module.exports.readFile(
      "./cvsFiles/regularUser.csv"
    );
    let indexOfBook = sheetData_response2.find(
      (value) => value["Book Name"] === BookName.toLowerCase()
    );
    if (!indexOfBook) {
      res.send({ message: "Book Not Found" }).status(404);
      return;
    }

    sheetData_response2.splice(sheetData_response2.indexOf(indexOfBook), 1);

    const csvWriter = createCsvWriter({
      path: "./cvsFiles/regularUser.csv",
      header: [
        { id: "Book Name", title: "Book Name" },
        { id: "Author", title: "Author" },
        { id: "Publication Year", title: "Publication Year" },
      ],
    });
    try {
      await csvWriter
        .writeRecords(sheetData_response2)
        .then(async () => {
          console.log("file write succesfully");
          res
            .status(200)
            .send({
              message: "Book Deleted Successuflly",
              Books: sheetData_response2,
            });
            return
        })
        .catch((err) => {
          res.status(500).send({ message: err });
        });
    } catch (err) {
      console.error("Error writing CSV file:", err);
    }
  },

  readFile: (path) => {
    const sheeTData = xlsx.readFile(path);
    let sheetData_sheet = sheeTData.SheetNames;
    let sheetData_response = xlsx.utils.sheet_to_json(
      sheeTData.Sheets[sheetData_sheet[0]]
    );

    return sheetData_response;
  },
};
