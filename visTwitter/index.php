<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css" />
	<link rel="stylesheet" href="stylesheets/style.css" />	
	<title>Twitter Visualization</title>
</head>
<body>
	
	<div id="cover">
		
				<div id="navi">
			
			<span id="title">Group-JIL146</span>
			<img src="images/logo.png" alt="logo" id="logo"/>
		</div>
		
		<div class="container">
			<div ><img src="images/twitter.png" alt="Twitter" id="image"/></div>
			<div id="gname">
				<h1>"Visual" #Thanksgiving</h1>
				<h3>Group-JIL146</h3>
			</div>
  		<div class="text-center">
				<a class="btn btn-default" style="visibility:hidden" id="play">Let's Begin Now!</a>
			</div>
			<div><img src="images/loading.gif" alt="Loading" id="loading"/></div>




		</div>
		<footer class="Footer Footer--global">
		  <hr>
		  <div class="Footer-copyright">
		  		<h5>&#169; Copyright Group-JIL146. </h5>Jiayu Liu [ <a href="mailto: jil146@pitt.edu">JIL146</a> ]; Yan Ma [ <a href="mailto: yam14@pitt.edu">YAM14</a> ]; Shujun Zhang [ <a href="mailto: shz53@pitt.edu">SHZ53</a> ]; Yiran Li [ <a href="mailto: yil129@pitt.edu">YIL129</a> ].
		  </div>
		</footer>


	</div>


	<div class="container">
		<h1 class="text-center" style="font-size:30px;font-weight:600;margin-top:5px;">"Visual" #Thanksgiving</h1>
		<div class="row" style="overflow:auto;margin-bottom:10px;">
			<div class="col-xs-12" style="width:120%;padding:12px 15px">
				<a class="btn btn-default date" data-date='11/21'>11/21</a>
				<a class="btn btn-default date" data-date='11/22'>11/22</a>
				<a class="btn btn-default date" data-date='11/23'>11/23</a>
				<a class="btn btn-default date" data-date='11/24'>11/24</a>
				<a class="btn btn-default date" data-date='11/25'>11/25</a>
				<a class="btn btn-default date" data-date='11/26'>11/26</a>
				<a class="btn btn-default date" data-date='11/27'>11/27</a>
				<a class="btn btn-default date" data-date='11/28'>11/28</a>
				<a class="btn btn-default date" data-date='11/29'>11/29</a>
				<a class="btn btn-default date" data-date='11/30'>11/30</a>
				<a class="btn btn-default date" data-date='12/1'>12/1</a>
				<a class="btn btn-default date" data-date='12/2'>12/2</a>
				<a class="btn btn-default date" data-date='12/3'>12/3</a>
				<a class="btn btn-default date" data-date='12/4'>12/4</a>
				<a class="btn btn-default date" data-date='12/5'>12/5</a>
				<a class="btn btn-default date" data-date='12/6'>12/6</a>
			</div>
		</div>	
		<div class="clearfix">
			<div id="meta-info">
				<p style="font-size:16px">Tweets in <span class="state-indicate"></span> (&nbsp;<span class="date-indicate"></span>&nbsp;)</p>
				<div id="pie-chart"></div>
				<!-- <button class="randomize">randomize</button> -->
				<div id="color-info">
					<span class='disabled-color'>Disabled</span>
					<span class='selected-color'>Selected</span>
				</div>
				<div id="palette" class="clearfix"></div>

			</div>			
			<div id="main-map"></div>
		</div>
		<div id="line-chart"></div>
		<div id="force-layout"></div>
		<div id="bar-chart"></div>

	</div>




	<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
  <script src="http://d3js.org/d3.v3.min.js"></script>
  <script src="http://d3js.org/topojson.v1.min.js"></script>
  <script src="javascripts/app.js"></script>

</body>
</html>