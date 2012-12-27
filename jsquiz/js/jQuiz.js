var quizModule = function (questionAnswers, divMarker) {

    // Get the HTML for the quiz.
	var quizHTML = createQuizHTML(questionAnswers);
	
	// update dom
	divMarker.after(quizHTML); 
	addEventListenets(questionAnswers);
	
	// creates the HTML for the questions answer
	function createQuizHTML(questionAnswers) {
	   // Question will be something like:
	   // {questions:[{"question":"Name the best Rugby team?", 
	   //						"answers":["Leinster", "Munster", "Ulster", "Connaught"],
	   //						"correct_answer":"Leinster"},
	   //			   {"question":"Name the best DJ?", 
	   //						"answers":["Warren K", "Pressure", "Digweed", "Sasha"],
	   //						"correct_answer":"Leinster"}]};
	   //
	   var returnString = new Array();
	   $.each(questionAnswers.questions, function(i, val){	

	        // panel div begin
			if (i === 0) {
			   returnString.push('<div class="questionContainer radius">');
			} else {
			   returnString.push('<div class="questionContainer hide radius">');
			}
			
			returnString.push('<div class="question"><b><span>' + val.question + '</span></b></div>');

			returnString.push('<div class="answers">');  // answers div begin
			returnString.push('<ul>');                   // list begin
			
			var textForAnswers = val.answers;
			$.each(textForAnswers, function(j, answer) {
			    returnString.push('<li class="answeritem"><label><input type="radio" name="q' + i + '" id="q' + i + '-' + j + '"/><span>' +  answer + '</span></label></li>');    // Add each answer
			}); // end answer iteration.
			
			returnString.push('</ul>');							// list end
			returnString.push('</div>'); 		        		// answers div end
			// next / prev button
			returnString.push('<div class="btnContainer">');
            returnString.push('<div class="prev">');
			if (i > 0) {
				returnString.push('<a class="btnPrev">&lt;&lt; Prev</a>');
			}
            returnString.push('</div>');               			// end prev div
			// Is it the last? 
			if (i === (questionAnswers.questions.length - 1)) { 
			    returnString.push('<div class="next">');
                returnString.push('<a class="btnShowResult">Finish!</a>');
				returnString.push('</div>');
			} else {
				returnString.push('<div class="next">');
				returnString.push('<a class="btnNext">Next &gt;&gt;</a>');
				returnString.push('</div>');               			// end  next div
			}
            returnString.push('<div class="clear"></div>');  	// begin / end clear div
			returnString.push('</div>');                		// end btn contained div 
			returnString.push('</div>');                        // end panel div

	   });
	   returnString.push('<div id="txtStatusBar">Status Bar</div>');
	   returnString.push('<div id="progressKeeper" class="radius">');
	   returnString.push('<div id="progress"></div>');
	   returnString.push('</div>');
	   returnString.push('<div id="resultKeeper" class="radius hide"></div>');
   
	   return returnString.join('');
	}
	
	function addEventListenets(quizQuestions){
		$('.btnNext').click(function(){
			if ($('input[type=radio]:checked:visible').length == 0) {
						
				return false;
			}
			$(this).parents('.questionContainer').fadeOut(500, function(){
				$(this).next().fadeIn(500)
			});
			var el = $('#progress');
			el.width(el.width() + ($('#progressKeeper').width() / quizQuestions.questions.length) + 'px');
		});
		$('.btnPrev').click(function(){
			$(this).parents('.questionContainer').fadeOut(500, function(){
				$(this).prev().fadeIn(500)
			});
			var el = $('#progress');
			el.width(el.width() - ($('#progressKeeper').width()  / quizQuestions.questions.length) + 'px');
		})
		$('.btnShowResult').click(function(){
			var arr = $('input[type=radio]:checked');
			var userAnswers = [];
			for (var i = 0, ii = arr.length; i < ii; i++) {
				userAnswers.push(arr[i].getAttribute('id'))
			}
            // progress update
			// remove it.
			$('#progressKeeper').fadeOut(500);
			$('#txtStatusBar').fadeOut(500);
			
			displayResults(userAnswers, quizQuestions);
		})
    }
	
	function displayResults(userAnswers, quizQuestions) {
		// Now check answers.
		var results = checkAnswers(userAnswers, quizQuestions);
		var resultSet = '';
		var trueCount = 0;
			
		resultSet += '<table id="resultsTable">';
		resultSet += '<caption>Quiz Results</caption>'
		resultSet += '<tr><th></th><th>Question</th><th>Your answer</th><th>Correct answer</th><th>Pass / Fail</th></tr>';
		for (var i = 0, ii = results.length; i < ii; i++){
			if (results[i] == true) trueCount++;
			var passFailCell = '';
			if (results[i]) {
				passFailCell = '<td>Pass</td>';   
			} else {
				passFailCell = '<td COLOR="Red">Fail</td>';
			}
				
			// for ( var j = 0, j < quizQuestions.questions[i].answers.length, j++) { 
			// var answerTokenArray = quizQuestions.questions[i].answers[j].
			var userAnswerIndex = userAnswers[i].split('-')[1];
			var userAnswer = quizQuestions.questions[i].answers[userAnswerIndex];
            var correctAnswer = quizQuestions.questions[i].answers[quizQuestions.questions[i].correct_answer];
			if ((i % 2) === 0) { 
				resultSet += '<tr>';
			} else {
				resultSet += '<tr class="alt">';
			}
			resultSet += '<td>' + i + '</td><td>' + quizQuestions.questions[i].question + '</td><td>' + userAnswer + '</td><td>' +
				                correctAnswer + '</td>' +
								passFailCell + '</tr>';
		}
		resultSet += '</table>';
		resultSet += '<div class="totalScore">Your total score is ' + trueCount * (100 / quizQuestions.questions.length) + '!</div>'
		$('#resultKeeper').html(resultSet).show();
	}
	
	function checkAnswers(userAnswers, quizQuestions) {
		var resultArr = [];
		for (var i = 0, ii = userAnswers.length; i < ii; i++){ 
			var userAnswerIndex = userAnswers[i].split('-')[1];;
			var questionInfo = quizQuestions.questions[i];
			var correctAnswer = questionInfo['correct_answer'];
			var success = false;
			if (userAnswerIndex === correctAnswer) {
				success = true;
			}
			else {
				success = false;
			}
			resultArr.push(success);
		}
		return resultArr;
	}

	my  =  {};  // don't know if I need this.
    return my;
}

