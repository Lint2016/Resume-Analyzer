// 

resumeUpload.addEventListener('change',(event)=>{// change event is fired when the file is selected
    const file = event.target.files[0];// access the html element which triggers the event
    console.log(file);  
})
// we attach a click event to the button to help analyze 
 
document.getElementById('analyzeBtn').addEventListener('click', () => {
  console.log('analyzeBtn is clicked');

  const jobDescription = document.getElementById('jobDescription').value.trim();
  const resumeUpload = document.getElementById('resumeUpload');
  const file = resumeUpload.files[0];
  // Validation
  if (!jobDescription || !file) {
    Swal.fire({
      title: 'Upload Resume & Job Description',
      text: 'Please upload a resume and paste a job description to compare and see if it\'s a match and where to improve to get hired.',
      icon: 'info',
      confirmButtonText: 'Got it!',
      confirmButtonColor: '#3085d6',
      allowOutsideClick: false,
      allowEscapeKey: false
    });
    return; // Stop here if input is invalid
  }
  //check the file type which is being uploaded
  if(file.type=== 'application/pdf'){
    readPDF(file,jobDescription)
  }else if(file.type==='plain/text'){
    readText(file,jobDescription)
  }else{
    Swal.fire('Please upload a plain text(.text) or PDF format file to compare')
  }

  // Read file using FileReader API, for plain text
  function readText(file, jobDescription){
    const reader = new FileReader();
    reader.onload = function (event) {
    const skillSet = event.target.result; // The file content
    console.log("Resume text:", skillSet);
    compareTexts(skillSet, jobDescription); // Pass job description
  };
  reader.readAsText(file); // Read uploaded file as text
  }
  //read pdf file
  function readPDF(file, jobDescription){
    const reader=new FileReader();
    reader.onload = function(){
     const pdfData = new Uint8Array(reader.result)
     pdfjsLib.getDocument(pdfData).promise.then(function(pdf){
      let allText= '';
      const readAllPages = async()=>{
        for(let i=1; i<= pdf.numPages;i++){
            const page=await pdf.getPage(i);
            const content =await page.getTextContent();
            const strings =content.items.map(items=>items.str);
            allText+=strings.join('')+'';
        }
        compareTexts(allText,jobDescription)
      }
      readAllPages()
     })
    }
    reader.readAsArrayBuffer(file);//this is required for pdf
  }

  // Text comparison function
  function compareTexts(resume, jobDescription) {
    //we convert the 2 above parameters to lowercase to insure incensitive comparison
    const resumeLower = resume.toLowerCase(); 
    const jobLower = jobDescription.toLowerCase();
 //split text into words using singular expression and \W+ matches all non-word characters
 //with filter we keep only words with 3 characters, 
 //with this jobWord is an array of relevant words from the job description
    const jobWords = jobLower.split(/\W+/).filter(word => word.length > 3);
    //go through each jobWord and checks if that word exists anywhere in the resume
    const matchedWords = jobWords.filter(word => resumeLower.includes(word));
//Divide the number of matched words by total job-related words , divide by 100 to get %
    const matchPercent = Math.round((matchedWords.length / jobWords.length) * 100);

    Swal.fire({
      title: `Match Score: ${matchPercent}%`,
      html: `
        <p><strong>${matchedWords.length}</strong> out of <strong>${jobWords.length}</strong> job-related words found in your resume.</p>
        ${matchPercent >= 60 
          ? '✅ You are a good match!' 
          : '🛠️ Consider updating your resume with missing keywords.'}
      `,
      icon: matchPercent >= 60 ? 'success' : 'warning',
    });
  }
});

//reset the app 
document.getElementById('restart').addEventListener('click', ()=>{
  console.log('restart button is clicked')
  document.getElementById('jobDescription').value=''
  document.getElementById('resumeUpload').value=''
})
