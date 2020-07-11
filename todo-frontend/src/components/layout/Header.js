import React from 'react'
import AuthOptions from './../auth/AuthOptions'

export default function Header() {
    return (
        <header className="bg-white shadow-md">
            
            <nav className="px-6 py-2 shadow">
            <div className="md:flex items-center justify-between">
                <div className="flex justify-between items-center">
                    <div>
                        <a href="#" className="text-xl font-bold text-gray-800 hover:text-gray-700 md:text-2xl">Todo App</a>
                    </div>
            
                    <div className="md:hidden">
                        <button type="button" className="block text-gray-700 hover:text-gray-600 focus:text-gray-600 focus:outline-none" aria-label="Toggle menu">
                            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                                <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            
                <div className="flex flex-col -mx-2 mt-2 opacity-0 md:mt-0 md:flex-row md:opacity-100">
                    <AuthOptions/>
                </div>
            </div>
        </nav>

        
            
        
        </header>
    )
}
