import fs from 'node:fs/promises';
import ollama from 'ollama'
import parseArgs from 'minimist'
import readline from 'readline'



var args = parseArgs(process.argv.slice(2))

var place;

if(args.p == undefined){
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const askQuestion = (question) => {
      return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
          resolve(answer);
        });
      });
    };

    place = await askQuestion('What place would you like to learn about?')
}

else{
    place = args.p;
}


var messages = []
messages[0] = {role: 'system', content: 'You are an academics geology teacher. You do not use listings or enumerations. You are preparing for a lecture and writing notes about it. '}

var i = 1;


var files = await fs.readdir('./');
files = files.filter((word) => word.startsWith('template'));

var j = 0;
for(i; i <= files.length; i++){
    messages[i * 2 - 1] = {};
    messages[i * 2 - 1].role = 'user';
    messages[i * 2 - 1].content = "Give a summary of the geological history of the " + files[j].split('_')[1].split('.')[0] + ". Then give a summary about the climate of the region of the Alps. End the summary with the effects of climate change. Use the format: 'Geological History: [geological history] Climate: [climate] Effects of climate changes: [climate change]'";
    messages[i * 2] = {};
    messages[i * 2].role = 'assistant';
    messages[i * 2].content = await fs.readFile('./' + files[j], {encoding: 'utf8'});
    j++;
}


messages[i * 2 - 1] = {}
messages[i * 2 - 1].role = 'user';
messages[i * 2 - 1].content = "Give a summary of the geological history of "+ place + ". Then give a summary about the climate of the region. End the summary with the effects of climate change. Include numeric data  . Use the format: 'Geological History: [geological history] Climate: [climate] Effects of climate changes: [climate change]'"

const response = await ollama.chat({
  model: 'deepseek-v2:16b',
  messages: messages,
  options: {temperature: 1.3}
})
console.log(response.message.content)