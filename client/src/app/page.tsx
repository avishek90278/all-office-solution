import Link from 'next/link';
import { FileStack, Scissors, Image as ImageIcon, Shield, RotateCw, Crop, PenTool, Globe, FileText, Brain, Wrench, Search } from 'lucide-react';

const tools = [
  {
    id: 'merge',
    name: 'Merge PDF',
    description: 'Combine PDFs in the order you want with the easiest PDF merger available.',
    icon: FileStack,
    color: 'bg-red-500',
    href: '/tools/merge'
  },
  {
    id: 'split',
    name: 'Split PDF',
    description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
    icon: Scissors,
    color: 'bg-red-500',
    href: '/tools/split'
  },
  {
    id: 'office-to-pdf',
    name: 'Office to PDF',
    description: 'Convert Word, Excel, and PowerPoint to PDF.',
    icon: FileText,
    href: '/tools/office-to-pdf',
    color: 'bg-blue-500'
  },
  {
    id: 'summarize',
    name: 'AI Summarizer',
    description: 'Get an instant summary of your PDF using AI.',
    icon: Brain,
    href: '/tools/summarize',
    color: 'bg-purple-500'
  },
  {
    id: 'repair',
    name: 'Repair PDF',
    description: 'Fix damaged or corrupted PDF files.',
    icon: Wrench,
    href: '/tools/repair',
    color: 'bg-gray-500'
  },
  {
    id: 'ocr',
    name: 'OCR PDF',
    description: 'Extract text from scanned PDF pages.',
    icon: Search,
    href: '/tools/ocr',
    color: 'bg-yellow-500'
  },
  {
    id: 'compress',
    name: 'Compress PDF',
    description: 'Reduce file size while optimizing for maximal PDF quality.',
    icon: FileStack, // Placeholder
    color: 'bg-red-500',
    href: '/tools/compress'
  },
  {
    id: 'img-to-pdf',
    name: 'JPG to PDF',
    description: 'Convert JPG images to PDF in seconds. Easily adjust orientation and margins.',
    icon: ImageIcon,
    color: 'bg-yellow-500',
    href: '/tools/img-to-pdf'
  },
  {
    id: 'rotate',
    name: 'Rotate PDF',
    description: 'Rotate your PDF files as you want. Rotate multiple PDF files at the same time.',
    icon: RotateCw,
    color: 'bg-blue-500',
    href: '/tools/rotate'
  },
  {
    id: 'protect',
    name: 'Protect PDF',
    description: 'Encrypt your PDF file with a password to prevent unauthorized access.',
    icon: Shield,
    color: 'bg-gray-800',
    href: '/tools/protect'
  },
  {
    id: 'watermark',
    name: 'Watermark',
    description: 'Stamp an image or text over your PDF in seconds. Typography, transparency and position.',
    icon: FileStack, // Placeholder
    color: 'bg-red-400',
    href: '/tools/watermark'
  },
  {
    id: 'organize',
    name: 'Organize PDF',
    description: 'Sort pages of your PDF file however you like. Delete PDF pages or add PDF pages to your document at your convenience.',
    icon: FileStack, // Placeholder
    color: 'bg-indigo-500',
    href: '/tools/organize'
  },
  {
    id: 'page-numbers',
    name: 'Page Numbers',
    description: 'Add page numbers into your PDF documents easily. Choose your position, dimensions, typography.',
    icon: FileStack, // Placeholder
    color: 'bg-orange-500',
    href: '/tools/page-numbers'
  },
  {
    id: 'crop',
    name: 'Crop PDF',
    description: 'Crop your PDF. Select an area of your PDF page to crop.',
    icon: Crop,
    color: 'bg-green-600',
    href: '/tools/crop'
  },
  {
    id: 'sign',
    name: 'Sign PDF',
    description: 'Sign yourself or request electronic signatures from others.',
    icon: PenTool, // Placeholder
    color: 'bg-purple-600',
    href: '/tools/sign'
  },
  {
    id: 'html-to-pdf',
    name: 'HTML to PDF',
    description: 'Convert web pages or HTML files to PDF documents.',
    icon: Globe, // Placeholder
    color: 'bg-teal-600',
    href: '/tools/html-to-pdf'
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    description: 'Convert each PDF page into a JPG or extract all images contained in a PDF.',
    icon: ImageIcon,
    color: 'bg-yellow-600',
    href: '/tools/pdf-to-jpg'
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-slate-900 text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Every tool you need to work with PDFs in one place</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Link key={tool.id} href={tool.href} className="group">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col items-center text-center">
                <div className={`${tool.color} text-white p-4 rounded-full mb-6 group-hover:scale-110 transition-transform`}>
                  <tool.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{tool.name}</h3>
                <p className="text-gray-500 leading-relaxed">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
