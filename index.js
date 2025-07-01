const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

let phonebook = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/info", (req, res) => {
  const now = new Date();
  res.send(
    `<p>Phonebook has info for ${
      phonebook.length
    } people</p><p>${now.toString()}</p>`
  );
});

app.get("/api/persons", (req, res) => {
  res.json(phonebook);
});

const generateId = () => {
  const maxId =
    phonebook.length > 0 ? Math.max(...phonebook.map((p) => Number(p.id))) : 0;
  return String(maxId + 1);
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name or number missing" });
  }

  if (phonebook.some((person) => person.name === body.name)) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  phonebook = phonebook.concat(person);
  res.json(person);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = phonebook.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  phonebook = phonebook.filter((person) => person.id !== id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
