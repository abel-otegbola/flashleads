/* eslint-disable react-hooks/immutability */
'use client'
import { Moon, Sun, Tablet } from "@solar-icons/react";
import { type ReactElement, useEffect, useState } from "react";
import Button from "../button/Button";

interface Theme {
    id: string | number, img: ReactElement, title: string
}

type Themes = Array<Theme>


function ThemeSelector() {
    const [theme, setTheme] = useState("")

    const themes: Themes = [
        { id: 0, img: <Tablet />, title: "auto" },
        { id: 1, img: <Sun />, title: "light" },
        { id: 2, img: <Moon />, title: "dark" },
    ]

    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
            setTheme("dark")
        } else {
            document.documentElement.classList.remove('dark')
            setTheme("light")
        }
        if(!localStorage.theme) {
            setTheme("auto")
        }
    }, [theme])

    const themeChange = (value: string) => {
        const root = document.documentElement;
        setTheme(value)
        if(value === 'light') {
            localStorage.theme = 'light'
            root.style.colorScheme = 'light'
            root.setAttribute('data-theme', 'light')
        }
        else if(value === 'dark') {
            localStorage.theme = 'dark'
            root.style.colorScheme = 'dark'
            root.setAttribute('data-theme', 'dark')
        }  
        else {
            localStorage.removeItem('theme')
        } 
    }

    return (
        <div className="flex gap-2">
            {
                themes.map(item => {
                    return (
                        <Button 
                            key={item.id} 
                            variant={item.title === theme ? "primary" : "secondary"}
                            aria-label={"Theme setting changed to "+ theme} 
                            onClick={() => themeChange(item.title)} 
                            className="shadow-none capitalize"
                        >
                            {item.img}
                            {item.title}
                        </Button>
                    )
                })
            }
        </div>
    )
}

export default ThemeSelector;