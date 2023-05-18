import path from 'path'
import { URL } from 'url'; // in Browser, the URL in native accessible on window
import express from "express";
import { writeFile, readFile } from "node:fs/promises";
import { nanoid } from 'nanoid';

//Declare the path of index.html
const __dirname = new URL('.', import.meta.url).pathname;
const ruta = path.join(__dirname + "/index.html")

//Set express to an app variable

const app = express();

//To serve static files in the defined folder
app.use(express.static('public'));

// Activate middleware that will let us receive data from the client across the request.
app.use(express.json());


//Define a const with 2 possible values, one that comes from a .env if it exists and a default if not.
const PORT = process.env.PORT || 3000;

//Start the server
app.listen(PORT, () => {
  console.log(`Server en puerto: http://localhost:${PORT}`);
});


//Load index.html
app.get("/", (req, res) => {
  res.sendFile(ruta);
})


//get method to retrieve all songs
app.get("/canciones", async (req, res) => {
  try {
    const fsResponse = await readFile("repertorio.json", "utf-8");
    const musicList = JSON.parse(fsResponse);
    res.json(musicList);
  } catch (error) {
    console.log(error)
  }

});


// Post Method to add song
app.post("/canciones", async (req, res) => {
  const { title, artist, key } = req.body;

  if (!title || !artist || !key) {
    return res.status(400).json({ proccess_finished: false, msg: "Title, artist and key are required." })
  }

  const newSong = {
    id: nanoid(),
    title,
    artist,
    key
  };

  try {
    const fsResponse = await readFile("repertorio.json", "utf-8");
    const musicList = JSON.parse(fsResponse);
    musicList.push(newSong);
    await writeFile("repertorio.json", JSON.stringify(musicList));
    res.status(201).json({
      proccess_finished: true,
      msg: "New song added to the repertoire",
      song: newSong
    });
  } catch (error) {
    console.log(error)
  }

});


// PUT Method to modify an existing song
app.put("/canciones/:id", async (req, res) => {
  const { id } = req.params;
  const { title, artist, key } = req.body;

  if (!title || !artist || !key) {
    return res.status(400).json({ proccess_finished: false, msg: "Title, artist and key are required." })
  }

  try {
    const fsResponse = await readFile("repertorio.json", "utf-8");
    const musicList = JSON.parse(fsResponse);

    const newMusicList = musicList.map((song) => {
      if (song.id === id) {
        return {
          ...song, title, artist, key
        };
      }
      return song;
    });

    await writeFile("repertorio.json", JSON.stringify(newMusicList));
    res.status(200).json({
      proccess_finished: true,
      msg: "Song updated."
    });
  } catch (error) {
    console.log(error)
  }

});


// Delete method to erase a song from the json file
app.delete("/canciones/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const fsResponse = await readFile("repertorio.json", "utf-8");
    const musicList = JSON.parse(fsResponse);
    const newMusicList = musicList.filter((song) => song.id !== id);
    await writeFile("repertorio.json", JSON.stringify(newMusicList));

    res.status(200).json({
      proccess_finished: true,
      msg: "Song deleted"
    })
  } catch (error) {
    console.log(error)
  }
})


