

function homePage()
{
	var win = Ti.UI.createWindow({
		backgroundColor: 'white',
	});
	
	var scrollView = Ti.UI.createScrollView({
		contentHeight: 'auto',
		layout: 'vertical',
		backgroundColor: 'none',
		zIndex: 2,
	});
	win.add(scrollView);
	
	var logo = Ti.UI.createImageView({
		image: 'familia.png',
		width: '10%',
		top: 30,
	});
	scrollView.add(logo);
	//win.add(logo);
	
	var text = Ti.UI.createLabel({
		text: 'StarsEarth',
		font: { fontSize: 40, },
	});
	scrollView.add(text);
	
	var banner_bkg = Ti.UI.createView({
		width: '100%',
		height: 50,
		top: 20,
		backgroundColor: 'blue',
		borderColor: 'blue',
	})
	
	var banner_txt = Ti.UI.createLabel({
		color: 'white',
		text: 'We are currently testing StarsEarth for iPhone.\n If you would like to be a tester, click here for further instructions',
		textAlign: 'center',
	});
	banner_bkg.add(banner_txt);
	scrollView.add(banner_bkg);
	
	banner_txt.addEventListener('click', function() {
		
	});
	
	var about_starsearth = Ti.UI.createLabel({
		text: 'About StarsEarth',
		textAlign: 0,
		top: 20,
		left: 50,
		font: { fontSize: 30, fontWeight: 'bold' },
	});
	scrollView.add(about_starsearth);
	
	var main_text = Ti.UI.createLabel({
		text: "StarsEarth is an app that allows you to record your child's daily progress in different aspects of his life. You can\n "+
				"make entries about observations that you or anyone else makes about the things your child does everyday, you \n "+
				"can keep records of appointments with doctots/therapists and you can also schedule medication treatments and\n "+
				"other activities designed to help your child achieve certain goals. All this information is neatly maintained in a\n "+
				"quick and easily searchable way making StarsEarth a convinient record book for your child.",
		textAlign: 0,
		top: 20,
		left: 50,
	})
	scrollView.add(main_text);
	
	var view = Ti.UI.createView({
		width: '100%',
		height: 400,
		top: 50,
	});
	scrollView.add(view);
	
	var text = Ti.UI.createLabel({
		text: "Log and maintain entries about\n important things in your child's life",
		font: { fontSize: 20, fontWeight: 'bold', },
		left: 50,
		top: 50,
	});
	view.add(text);
	
	var view2 = Ti.UI.createView({
		width: '100%',
		height: 400,
		top: 50,
	});
	scrollView.add(view2);
	
	var text2 = Ti.UI.createLabel({
		text: "Maintain records of appointments with doctors/therapists",
		font: { fontSize: 20, fontWeight: 'bold', },
		left: 50,
		top: 50,
	});
	view2.add(text2);
	
	var view3 = Ti.UI.createView({
		width: '100%',
		height: 400,
		top: 50,
	});
	scrollView.add(view3);
	
	var text3 = Ti.UI.createLabel({
		text: "Schedule activities and treatments",
		font: { fontSize: 20, fontWeight: 'bold', },
		left: 20,
		top: 20,
	});
	view3.add(text3);
	
	var view4 = Ti.UI.createView({
		width: '100%',
		height: 400,
		top: 50,
	});
	scrollView.add(view4);
	
	var text4 = Ti.UI.createLabel({
		text: "Share successful treatments on social media",
		font: { fontSize: 20, fontWeight: 'bold', },
		left: 20,
		top: 20,
	});
	view4.add(text4);
	
	var testers_view = Ti.UI.createView({
		width: '100%',
		height: 400,
		top: 50,
	});
	scrollView.add(testers_view);
	
	var testers_instructions = Ti.UI.createLabel({
		text: "Instructions for testers (iPhone and iPad)",
		font: { fontSize: 20, fontWeight: 'bold', },
		left: 20,
		top: 20,
	});
	testers_view.add(testers_instructions);
	
	return win;
}

module.exports = homePage;
