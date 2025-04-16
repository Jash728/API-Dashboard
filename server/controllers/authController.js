import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Brand from "../models/Brand.js";

export const registerBrand = async (req, res) => {
  const { email, password, name } = req.body;

  
  const existingBrand = await Brand.findOne({ email });
  if (existingBrand) return res.status(400).json({ message: 'Brand already exists' });

  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  
  const brand = new Brand({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await brand.save();
    res.status(201).json({ message: 'Brand created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating brand', error: err });
  }
};


export const loginBrand = async(req, res) => {
  const { email, password } = req.body;

  
  const brand = await Brand.findOne({ email });
  if (!brand) return res.status(400).json({ message: 'Invalid credentials' });
  console.log(brand)

 
  const isMatch = await bcrypt.compare(password.trim(), brand.password);

  console.log(isMatch)
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  

  
  const token = jwt.sign({ id: brand._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

 
  res.json({
    token,
    brand: {
      _id: brand._id,
      name: brand.name,
      email: brand.email,
    },
  });
}