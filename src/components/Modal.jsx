import React from 'react'

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
            <div className="bg-white rounded-xl p-6 max-h-[90vh] overflow-y-auto w-full max-w-3xl relative shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    )
}

export default Modal
