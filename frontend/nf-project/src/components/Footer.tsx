export default function Footer() {
    return (
        <footer className="bg-gray-800 p-4 mt-auto">
            <div className="container mx-auto text-center text-gray-300">
                &copy; {new Date().getFullYear()} MyApp. All rights reserved.
            </div>
        </footer>
    );
}