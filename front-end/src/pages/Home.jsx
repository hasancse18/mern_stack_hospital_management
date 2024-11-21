import React from 'react'
import Hero from "../components/Hero";
import Biography from "../components/Biography";
import MessageForm from "../components/MessageForm";
import Departments from '../components/Department';
const Home = () => {
  return <>
    <Hero title={"Welcome to Hospital"} imageUrl ={"/hero.png"}/>
    <Biography imageUrl={"/about.png"} />
    <Departments/>
    <MessageForm/>
  </>
}

export default Home
