import "./globals.css";

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body>
        <h4 className="p-4 rounded-sm shadow-md bg-slate-200 text-green-800 text-xl capitalize text-center font-medium">Next.Js ToDo List</h4>
        <div className="my-5 flex flex-col items-center justify-center">
          {children}
        </div>
      </body>
    </html>
  );
}
