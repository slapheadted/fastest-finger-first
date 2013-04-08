<h3 class="text-center">Question <%= model.question.question %></h3>
<button type="submit" class="btn btn-primary enableAnswering">Start Answering</button>
<div class="displayAnswerWrapper hide">
    <img class="displayAnswer" src="http://192.168.0.8/<%= model.question.answers[0].img %>" />
</div>
