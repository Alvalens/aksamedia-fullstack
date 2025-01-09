const Loader = () => {
    return (
        <div className="fixed top-0 left-0 z-50 w-screen h-screen flex justify-center items-center bg-opacity-25 pointer-events-none ">
            <div className="w-16 h-16 border-4 border-solid border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};

export default Loader;