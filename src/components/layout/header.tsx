function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
            <div>
                <h1 className="text-lg font-semibold text-gray-900">
                    TaskFlow
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                    Notifications
                </button>

                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                        U
                    </div>

                    <span className="hidden text-sm font-medium text-gray-700 sm:block">
                        User
                    </span>
                </div>
            </div>
        </header>
    );
}

export default Header;