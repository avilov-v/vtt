const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/capture-baseline', (req, res) => {
  const url = req.body.url;
  exec(`node playwright-tests/capture-baseline.js ${url}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send('Error capturing baseline');
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
    }
    console.log(`Stdout: ${stdout}`);
    res.redirect('/');
  });
});

app.post('/run-tests', (req, res) => {
  const url = req.body.url;
  exec(`node playwright-tests/run-tests.js ${url}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send('Error running tests');
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
    }
    console.log(`Stdout: ${stdout}`);

    const [loginDiffPixels, employeesDiffPixels] = stdout.trim().split(',').map(item => item.split(':')[1].trim());

    const results = [
      {
        name: 'Страница логина',
        baseline: '/baseline/login.png',
        screenshot: '/results/login.png',
        diff: '/results/login_diff.png',
        diffPixels: loginDiffPixels
      },
      {
        name: 'Список сотрудников',
        baseline: '/baseline/employees.png',
        screenshot: '/results/employees.png',
        diff: '/results/employees_diff.png',
        diffPixels: employeesDiffPixels
      }
    ];

    res.render('results', { results });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
