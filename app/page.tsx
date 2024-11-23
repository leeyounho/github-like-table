import GithubWikiTable from '@/components/GithubWikiTable'

interface TableData {
  title: string
  rows: [string, string][]
}

const sampleData : TableData[] = [
  {
    title: 'Git Commands',
    rows: [
      ['Clone a repository', 'git clone <repository-url>'],
      ['Create a new branch', 'git checkout -b <branch-name>'],
      ['Stage changes', 'git add .'],
      ['Commit changes', 'git commit -m "Your commit message"'],
      ['Push changes', 'git push origin <branch-name>'],
    ],
  },
  {
    title: 'npm Commands',
    rows: [
      ['Install dependencies', 'npm install'],
      ['Run development server', 'npm run dev'],
      ['Build for production', 'npm run build'],
      ['Start production server', 'npm start'],
      ['Add a new package', 'npm install <package-name>'],
    ],
  },
  {
    title: 'Long Strings Example',
    rows: [
      ['Short description', 'This is a short string'],
      ['Long description', 'This is a very long string that might cause layout issues if not handled properly. It should wrap nicely and not break the layout of the table or cause any overflow problems.'],
      ['Code snippet', `
function longFunction() {
  // This is a long function
  // with multiple lines
  // that should be displayed properly
  console.log("Hello, World!");
  return 42;
}
      `],
    ],
  },
]

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <GithubWikiTable data={sampleData} />
    </main>
  )
}

