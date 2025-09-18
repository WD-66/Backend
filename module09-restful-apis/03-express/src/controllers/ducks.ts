import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { Duck } from '#models';

export const getAllDucks: RequestHandler = async (req, res) => {
  try {
    const allDucks = await Duck.find();
    res.json(allDucks);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Something went wrong!' });
    }
  }
};

export const createDuck: RequestHandler = async (req, res) => {
  try {
    const { name, imgUrl, quote } = req.body;

    if (!name || !imgUrl || !quote) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const newDuck = await Duck.create(req.body);

    res.json(newDuck);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Could not create resource' });
    }
  }
};

export const getDuckById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    //isValidObjectId is a useful method from mongoose to check if a value is an actual objectID.
    if (!isValidObjectId(id))
      return res.status(400).json({ error: 'Invalid ID' });

    const duck = await Duck.findById(id);

    if (!duck) return res.status(404).json({ error: 'Duck Not Found' });

    res.json(duck);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const updateDuck: RequestHandler = async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ error: 'Missing fields' });
    const { name, imgUrl, quote } = req.body;
    const { id } = req.params;

    if (!name || !imgUrl || !quote) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    if (!isValidObjectId(id))
      return res.status(400).json({ error: 'Invalid ID' });

    const duck = await Duck.findByIdAndUpdate(
      id,
      {
        name,
        imgUrl,
        quote,
      },
      { new: true }
    );

    if (!duck) return res.status(404).json({ error: 'Duck Not Found' });

    res.json(duck);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const deleteDuck: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ error: 'Invalid ID' });

    const found = await Duck.findByIdAndDelete(id);

    if (!found) return res.status(404).json({ error: 'Duck Not Found' });

    res.json({ message: 'Duck deleted' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
