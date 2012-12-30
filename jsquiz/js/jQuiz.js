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
			returnString.push('<div class="question"><b>Question '  + (i+1) + ': ' + '</b><b><span>' + val.question + '</span></b></div>');

			returnString.push('<div class="answers">');  // answers div begin
			returnString.push('<ul>');                   // list begin
			
			var textForAnswers = val.answers;
			$.each(textForAnswers, function(j, answer) {
			    // get answer.
				var actualAnswer = val.correct_answer;
				if (val.correct_answer.split(',').length === 1) {
					// use check boxes
					returnString.push('<li class="answeritem"><label><input type="radio" name="q' + i + '" id="q' + i + '-' + j + '"/><span>' +  answer + '</span></label></li>');    // Add each answer
				} else {
					// else use radio buttons.
					returnString.push('<li class="answeritem"><label><input type="checkbox" name="q' + i + '" id="q' + i + '-' + j + '"/><span>' +  answer + '</span></label></li>');    // Add each answer
				}
			}); // end answer iteration.
			
			returnString.push('</ul>');							// list end
			returnString.push('</div>'); 		        		// answers div end
			// next / prev button
			returnString.push('<div class="btnContainer">');
            returnString.push('<div class="prev">');
			if (i > 0) {
				returnString.push('<a class="btnPrev pretty">&lt;&lt; Prev</a>');
			}
            returnString.push('</div>');               			// end prev div
			// Is it the last? 
			if (i === (questionAnswers.questions.length - 1)) { 
			    returnString.push('<div class="next">');
                returnString.push('<a class="btnShowResult pretty">Finish!</a>');
				returnString.push('</div>');
			} else {
				returnString.push('<div class="next">');
				returnString.push('<a class="btnNext pretty">Next &gt;&gt;</a>');
				returnString.push('</div>');               			// end  next div
			}
            returnString.push('<div class="clear"></div>');  	// begin / end clear div
			returnString.push('</div>');                		// end btn contained div 
			returnString.push('</div>');                        // end panel div

	   });
	   returnString.push('<div id="txtStatusBar">Progess Bar</div>');
	   returnString.push('<div id="progressKeeper" class="radius">');
	   returnString.push('<div id="progress"></div>');
	   returnString.push('</div>');
	   returnString.push('<div id="resultKeeper" class="radius hide"></div>');
   
	   return returnString.join('');
	}
	
	function addEventListenets(quizQuestions){
		$('.btnNext').click(function(){
			if (($('input[type=radio]:checked:visible').length == 0) && ($('input[type=checkbox]:checked:visible').length === 0)) {
				return false;
			}
			$(this).parents('.questionContainer').fadeOut(500, function(){
				$(this).next().fadeIn(500)
			});
			var el = $('#progress');
			var totalIncreaseAmount = ($('#progressKeeper').width() / quizQuestions.questions.length);
			//el.width((el.width() + totalIncreaseAmount) + 'px');
			var newWidth = el.width() + totalIncreaseAmount;
			el.animate({width:newWidth + 'px'}, 500);
		});
		$('.btnPrev').click(function(){
			$(this).parents('.questionContainer').fadeOut(500, function(){
				$(this).prev().fadeIn(500)
			});
			var el = $('#progress');
			el.width(el.width() - ($('#progressKeeper').width()  / quizQuestions.questions.length) + 'px');
		})
		$('.btnShowResult').click(function(){
			var el = $('#progress');
			el.width($('#progressKeeper').width() + 'px');
			
			// gather user Answers.
			var $arrRadio = $('input[type=radio]:checked');
			var $arrCheck = $('input[type=checkbox]:checked');
			var userAnswersMap = gatherUserAnswers($arrRadio, $arrCheck);	
			
            // progress update
			// remove it.
			$('#progressKeeper').fadeOut(500);
			$('#txtStatusBar').fadeOut(500);
			$('.btnNext').fadeOut(500);
			$('.btnPrev').fadeOut(500);
			$('.btnShowResult').fadeOut(500, displayResults(userAnswersMap, quizQuestions));
		})
    }
	
	function gatherUserAnswers(arrRadio, arrCheck) {
		var totalArr = arrRadio.add(arrCheck);
		var userAnswersMap = {};  // Collates check boxes for the same question.
		
		for (var i = 0, ii = totalArr.length; i< ii; i++) {
			// get id, will be of form: input#q0-0, input#q1-0
			var id = totalArr[i].getAttribute('id');  
			var questionPart = id.split('-')[0];
			var questionNumber = questionPart.split('q')[1];
			var userAnswer = id.split('-')[1];
			if (userAnswersMap[questionNumber]) {
				var currentAnswer = userAnswersMap[questionNumber];
				if (currentAnswer < userAnswer) {
					userAnswersMap[questionNumber] = currentAnswer + "," + userAnswer;
				} else {
					userAnswersMap[questionNumber] = userAnswer + "," + currentAnswer;
				}
			} else {
				userAnswersMap[questionNumber] = userAnswer;
			}
		}
		
		return userAnswersMap;
	}
	
	function displayResults(userAnswersMap, quizQuestions) {
		// Now check answers.
		var results = checkAnswers(userAnswersMap, quizQuestions);
		var resultSet = '';
		var trueCount = 0;
			
		resultSet += '<table id="resultsTable">';
		resultSet += '<caption>Quiz Results</caption>'
		resultSet += '<tr><th></th><th>Question</th><th>Your answer</th><th>Correct answer</th><th>Pass / Fail</th></tr>';
		for (var i = 0, ii = quizQuestions.questions.length; i < ii; i++){
			if (results[i] == true) trueCount++;
			var passFailCell = '';
			if (results[i]) {
				passFailCell = '<td>Pass</td>';   
			} else {
				passFailCell = '<td CLASS="fail">Fail</td>';
			}
				
			var userAnswerIndexes = userAnswersMap[i].split(',');
			var userAnswer = '';
			
			if (userAnswerIndexes.length > 1) {
				userAnswer += '<UL class="resultlist quizlist">';
				for ( var j = 0; j < userAnswerIndexes.length; j++) {
					if ((j % 2) === 0) {
						userAnswer += '<LI class="altli">' + quizQuestions.questions[i].answers[userAnswerIndexes[j]] + '</LI>';
					} else {
						userAnswer += '<LI>' + quizQuestions.questions[i].answers[userAnswerIndexes[0]] + '</LI>';
					}
				}
				userAnswer += '</UL>';
			} else {
			    userAnswer += quizQuestions.questions[i].answers[userAnswersMap[0]]
			}
			
			var correctAnswerIndexes = quizQuestions.questions[i].correct_answer.split(',');
			var correctAnswer = '';
			if (correctAnswerIndexes.length > 1) {
				correctAnswer += '<UL class="resultlist quizlist">';
				for ( var j = 0; j < correctAnswerIndexes.length; j++) {
					if ((j % 2) === 0) {
						correctAnswer += '<LI class="altli">' + quizQuestions.questions[i].answers[correctAnswerIndexes[j]] + '</LI>';
					} else {
						correctAnswer += '<LI>' + quizQuestions.questions[i].answers[correctAnswerIndexes[0]] + '</LI>';
					}
				}
				correctAnswer += '</UL>';
			} else {
			    correctAnswer += quizQuestions.questions[i].answers[correctAnswerIndexes[0]]
			}
 
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
		resultSet += '<div><I>Refresh page to try again</I></div>';
		$('#resultKeeper').html(resultSet).show();
	}
	
	function checkAnswers(userAnswersMap, quizQuestions) {
		var resultArr = [];
		for (var i = 0, ii = quizQuestions.questions.length; i < ii; i++){
			var userAnswer = userAnswersMap[i];;
			var questionInfo = quizQuestions.questions[i];
			var correctAnswer = questionInfo['correct_answer'];
			var success = false;
			if (userAnswer === correctAnswer) {
				success = true;
			} else {
				success = false;
			}
			resultArr.push(success);
		}
		return resultArr;
	}

	my  =  {};  // don't know if I need this.
    return my;
}

