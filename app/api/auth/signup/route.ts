import connectDB from '@/DB/connectDB';
import { User, UserRole } from '@/DB/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server'


export async function POST(request: Request) {
  const { authLogin, email, password } = await request.json();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  if (!authLogin || !email || !password) {
    return NextResponse.json({ message: " All fields are required" }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
  }
  // if (confirmPassword !== password) {
  //   return NextResponse.json({ message: "Password do not match" }, { status: 400 })
  // }
  // if (password.length < 6) {
  //   return NextResponse.json({ message: "Password must be at least 6 character long" }, { status: 400 });
  // }

  try {
    await connectDB();
    const existingUser = await User.findOne({ email }) || await User.findOne({ authLogin });
    if (existingUser) {
      return NextResponse.json({ message: "User already exist" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const initialUser = {
      email,
      authLogin: authLogin,
      name: authLogin,
      password: hashedPassword,
      image: null,
      role: UserRole.USER,
      dateCreate: new Date(),
      lastLogin: new Date(),
    }

    const newUser = new User(initialUser);
    await newUser.save();
    return NextResponse.json({ message: "User created" }, { status: 201 });

  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}