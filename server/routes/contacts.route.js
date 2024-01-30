import express from "express";
import { ObjectId } from "mongodb";

// Create Express app
const router = express.Router();

// Configure middleware
router.use(express.json()); // to parse JSON bodies

// ========== Routes ========== //

// GET all contacts
router.get("/", async (req, res) => {
  try {
    const users = await db.collection("users").find().toArray();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

// GET one contact by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

    if (!contact) {
      return res.status(404).send("No contact found with the given ID");
    }

    res.json(contact);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving contact from database");
  }
});

// POST create a new contact
router.post("/", async (req, res) => {
  try {
    const { image, mail, name, title } = req.body;
    const newUser = await db.collection("users").insertOne({
      image,
      mail,
      name,
      title,
    });
    res.json({ _id: newUser.insertedId });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Error creating a new user in database: " + error.message);
  }
});

// PUT update existing contact by id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { image, mail, name, title } = req.body;

    const result = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { image, mail, name, title } }
      );

    if (result.matchedCount === 0) {
      return res.status(404).send("No contact found with the given ID");
    }

    res.json({ _id: id, message: "Contact updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Error updating contact in database: " + error.message);
  }
});

// DELETE existing contact by id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send("No contact found with the given ID");
    }
    res.send({ _id: id, message: "Contact successfully deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Error deleting contact from database: " + error.message);
  }
});

// GET search contacts
router.get("/search", async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).send("No search term provided");
    }

    const contacts = await db
      .collection("users")
      .find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
        ],
      })
      .sort({ first: 1, last: 1 })
      .toArray();

    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving contacts from database");
  }
});

// PUT route to toggle favorite status
router.put("/:id/favorite", async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
    if (!contact) {
      return res.status(404).send("No contact found with the given ID");
    }

    const updatedFavoriteStatus = !contact.favorite;
    await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { favorite: updatedFavoriteStatus } }
      );

    res.json({
      _id: id,
      message: `Contact favorite status toggled to ${updatedFavoriteStatus}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error toggling favorite status in database");
  }
});

/* Get all contacts where favorite is true */
router.get("/favorites", async (req, res) => {
  try {
    const favoriteContacts = await db
      .collection("users")
      .find({ favorite: true })
      .toArray();
    res.json(favoriteContacts);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving favorite contacts from database");
  }
});

export default router;