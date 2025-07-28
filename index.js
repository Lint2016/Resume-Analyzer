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

  // Validation
  if (!jobDescription || !resumeUpload.files[0]) {
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

  // Read file using FileReader
  const reader = new FileReader();
  reader.onload = function (event) {
    const skillSet = event.target.result; // The file content
    console.log("Resume text:", skillSet);
    compareTexts(skillSet, jobDescription); // ✅ Corrected: pass job description
  };

  reader.readAsText(resumeUpload.files[0]); // Read uploaded file as text

  // Text comparison function
  function compareTexts(resume, jobDescription) {
    const resumeLower = resume.toLowerCase();
    const jobLower = jobDescription.toLowerCase();

    const jobWords = jobLower.split(/\W+/).filter(word => word.length > 3);
    const matchedWords = jobWords.filter(word => resumeLower.includes(word));

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
