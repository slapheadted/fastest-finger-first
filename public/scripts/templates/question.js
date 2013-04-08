<h3 class="text-center">Question <%= model.question.question %></h3>
<button type="submit" class="btn btn-primary enableAnswering">Start Answering</button>
<div class="displayAnswerWrapper hide">
    <img class="displayAnswer" src="http://localhost/<%= model.question.answers[0].img %>" />
</div>
