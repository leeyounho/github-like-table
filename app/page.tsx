import { GithubWikiTable } from '@/components/GithubWikiTable'
import { TableData } from "@/components/GithubWikiTable";

const sampleData:TableData[] = [
  {
    title: 'Git Commands',
    rows: [
      ['Clone a repository', 'git clone <repository-url>'],
      ['Create a new branch', 'git checkout -b <branch-name>'],
      ['Stage changes', 'git add .'],
      ['Commit changes', 'git commit -m "<commit-message>"'],
      ['Push changes', 'git push origin <branch-name>'],
    ],
    replacements: {
      '<repository-url>': 'https://github.com/username/repo.git',
      '<branch-name>': 'feature/new-feature',
      '<commit-message>': 'Add new feature'
    }
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
    replacements: {
      '<package-name>': 'react'
    }
  },
  {
    title: 'Docker Commands',
    rows: [
      ['Build an image', 'docker build -t <image-name> .'],
      ['Run a container', 'docker run -d -p <host-port>:<container-port> <image-name>'],
      ['List running containers', 'docker ps'],
      ['Stop a container', 'docker stop <container-id>'],
      ['Remove a container', 'docker rm <container-id>'],
    ],

},
  {
    title: 'Linux Commands',
    rows: [
      ['List files', 'ls -la'],
      ['Change directory', 'cd <directory>'],
      ['Create a directory', 'mkdir <directory-name>'],
      ['Remove a file', 'rm <file-name>'],
      ['Remove a directory', 'rm -r <directory-name>'],
    ],
  },
  {
    title: 'Python Commands',
    rows: [
      ['Run a Python script', 'python <script-name>.py'],
      ['Install a package', 'pip install <package-name>'],
      ['Create a virtual environment', 'python -m venv <env-name>'],
      ['Activate virtual environment (Windows)', '<env-name>\\Scripts\\activate'],
      ['Activate virtual environment (Unix)', 'source <env-name>/bin/activate'],
    ],
  },
  {
    title: 'Git Commands',
    rows: [
      ['View commit history', 'git log'],
      ['Undo last commit', 'git reset HEAD~1'],
      ['Discard changes', 'git checkout -- <file-name>'],
      ['Create a tag', 'git tag <tag-name>'],
      ['Push tags', 'git push --tags'],
    ],
  },
  {
    title: 'SQL Commands',
    rows: [
      ['Create a table', 'CREATE TABLE table_name (column1 datatype, column2 datatype, ...);'],
      ['Insert data', 'INSERT INTO table_name (column1, column2, ...) VALUES (value1, value2, ...);'],
      ['Select data', 'SELECT column1, column2, ... FROM table_name WHERE condition;'],
      ['Update data', 'UPDATE table_name SET column1 = value1, column2 = value2, ... WHERE condition;'],
      ['Delete data', 'DELETE FROM table_name WHERE condition;'],
    ],
  },
  {
    title: 'Kubernetes Commands',
    rows: [
      ['Apply a configuration', 'kubectl apply -f <filename.yaml>'],
      ['Get pods', 'kubectl get pods'],
      ['Describe a resource', 'kubectl describe <resource-type> <resource-name>'],
      ['Get logs', 'kubectl logs <pod-name>'],
      ['Execute command in a container', 'kubectl exec -it <pod-name> -- <command>'],
    ],
  },
]

export default function Home() {
  return (
    <main className="container mx-auto">
      <GithubWikiTable data={sampleData} />
    </main>
  )
}

