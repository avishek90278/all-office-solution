import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold text-xl">
                        P
                    </div>
                    <span className="text-xl font-bold text-gray-900">PrivatePDF</span>
                </Link>
                <nav className="hidden md:flex space-x-8">
                    <Link href="/" className="text-gray-900 font-medium hover:text-red-600">All Tools</Link>
                    <Link href="/tools/compress" className="text-gray-500 hover:text-gray-900">Compress</Link>
                    <Link href="/tools/img-to-pdf" className="text-gray-500 hover:text-gray-900">Convert</Link>
                </nav>
            </div>
        </header>
    );
}
