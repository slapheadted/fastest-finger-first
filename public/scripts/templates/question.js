<h3 class="text-center">Question <%= model.question.question %></h3>
<button type="submit" class="btn btn-success enableAnswering">Start Answering</button>
<button type="submit" class="btn btn-primary next hide">Next</button>
<div class="displayAnswerWrapper hide">
    <img class="displayAnswer <% if (model.question.answers[0].correct) { %>correct<% } %> mask" src="http://localhost/fastestfingerfirst/<%= model.question.answers[0].img %>" />
    <img class="displayAnswer <% if (model.question.answers[1].correct) { %>correct<% } %> mask" src="http://localhost/fastestfingerfirst/<%= model.question.answers[1].img %>" />
</div>
