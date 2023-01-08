import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuServiceService } from 'src/app/menu-service.service';
import { environment } from 'src/environments/environment';
import { parseHttpResponse } from 'selenium-webdriver/http';
import { AlertController } from '@ionic/angular';
import { Geolocation} from '@capacitor/core';
import { PlaceLocation } from 'src/app/LocationMap/location.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {

  appVerifier;
  code;
  form: FormGroup;




products = [
	{
		"name": "حمودة حليب كامل الدسم",
		"description": "1L",
		"price": "0.87",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حليب",
		"picture": "Hammoudeh Full Fat Milk",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "حموده حليب خالي الدسم",
		"description": "1L",
		"price": "0.87",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حليب",
		"picture": "Hammoudeh Skimmed Milk",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "حمودة حليب قليل الدسم",
		"description": "1L",
		"price": "0.87",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حليب",
		"picture": "Hammoudeh Low Fat Milk",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اليوم حليب قليل الدسم",
		"description": "1L",
		"price": "1.33",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حليب",
		"picture": "Alyoum Low Fat Fresh Milk",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اليوم حليب طازج خالي الدسم",
		"description": "1L",
		"price": "1.33",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حليب",
		"picture": "Alyoum Skimmed Fresh Milk",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اليوم حليب طازج كامل الدسم",
		"description": "1L",
		"price": "1.33",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حليب",
		"picture": "Alyoum Full Fat Fresh Milk",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "نادك حليب خالي من الدسم",
		"description": "1L",
		"price": "0.69",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حليب",
		"picture": "Nadec Skimmed Fresh Milk",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "نادك حليب قليل الدسم",
		"description": "1L",
		"price": "0.69",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حليب",
		"picture": "Nadec Low Fat Long Life Milk",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "نادك حليب كامل الدسم",
		"description": "1L",
		"price": "0.69",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حليب",
		"picture": "Nadec Full Fat Milk",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "كي دي دي حليب الشوكولاته قليل الدسم",
		"description": "1L",
		"price": "1.35",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حليب",
		"picture": "Kdd Low Fat Chocolate Milk",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "كي دي دي حليب بنكهة الفراولة قليل الدسم",
		"description": "1L",
		"price": "1.35",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حليب",
		"picture": "Kdd Low Fat Strawberry Milk",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "كي دي دي حليب بنكهة الموز قليل الدسم",
		"description": "1L",
		"price": "1.35",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حليب",
		"picture": "Kdd Low Fat Banana Flavored Milk",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "ندى حليب بنكهة الموز",
		"description": "1L",
		"price": "0.80",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حليب",
		"picture": "Nada Banana Flavored Milk",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اليوم حليب بنكهة الموز",
		"description": "200 ml",
		"price": "0.30",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حليب",
		"picture": "Alyoum Banana Milk",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اليوم حليب بنكهة الشوكولاتة",
		"description": "200 ml",
		"price": "0.30",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حليب",
		"picture": "Alyoum Chocolate Milk",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اليوم حليب بنكهة الفراولة",
		"description": "200 ml",
		"price": "0.30",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حليب",
		"picture": "Alyoum Strawberry Milk",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "كي دي دي حليب الشوكولاتة قليل الدسم",
		"description": "250 ml",
		"price": "0.38",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حليب",
		"picture": "Kdd Low Fat Chocolate Milk Small",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "كي دي دي حليب قليل الدسم بنكهة الفراولة",
		"description": "250 ml",
		"price": "0.38",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حليب",
		"picture": "Kdd Low Fat Strawberry Milk small",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "كي دي دي حليب بنكهة الموز قليل الدسم",
		"description": "250 ml",
		"price": "0.38",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حليب",
		"picture": " Kdd Low Fat Banana Milk Small",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اليوم حليب طازج كامل الدسم",
		"description": "300 ml",
		"price": "0.30",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حليب",
		"picture": "Alyoum Full Fat Fresh Milk Small Size",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "سنقرط بيض حجم كبير جدا",
		"description": "30 ct",
		"price": "2.80",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "جبنة",
		"picture": "Sinokrot Extra Large Eggs",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "سنقرط بيض بني حجم كبير جدا",
		"description": "30 ct",
		"price": "3.52",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "جبنة",
		"picture": "Sinokrat Extra Large Brown Eggs",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "المراعي جبنة موزاريلا",
		"description": "200 g",
		"price": "2.05",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "جبنة",
		"picture": "Almarai Mozzarella Cheese",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "حمودة جبنة فيتا",
		"description": "225 g",
		"price": "1.19",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "جبنة",
		"picture": "Hammoudeh Feta Cheese",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "حمودة جبنة حلوم",
		"description": "250 g",
		"price": "2.15",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "جبنة",
		"picture": "Hammoudeh Halloumi Cheese",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "حمودة جبنة بيضاء",
		"description": "250 g",
		"price": "1.66",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "جبنة",
		"picture": "Hammoudeh White Cheese",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "حمودة جبنة أريش",
		"description": "250 g",
		"price": "0.95",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "جبنة",
		"picture": "Hammoudeh Cottage Cheese",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "حمودة جبنة شركسية",
		"description": "250 g",
		"price": "2.00",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "جبنة",
		"picture": "Hammoudeh Circassian Cheese",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "امريكانا جبنة فيتا بيضاء ",
		"description": "250 g",
		"price": "0.62",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "جبنة",
		"picture": "Americana Feta White Cheese",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "حموده جبنة موزاريلا",
		"description": "400 g",
		"price": "3.80",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "جبنة",
		"picture": "Hammoudeh Mozzarella Cheese",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "المراعي جبنة مربعات قابلة للدهن",
		"description": "432 g",
		"price": "2.49",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "جبنة",
		"picture": "Almarai Spreadable Cheese Squares",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "حمودة جبنة عكاوي",
		"description": "450 g",
		"price": "3.25",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "جبنة",
		"picture": "Hammoudeh Akkawi Cheese",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "الصافي جبنة القشقوان",
		"description": "700 g",
		"price": "4.10",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "جبنة",
		"picture": "Alsafi Kashkaval Cheese",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "بلدنا جبنة شيدر مطبوخة",
		"description": "900 g",
		"price": "4.75",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "جبنة",
		"picture": "Baladna Processed Cheddar Cheese",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "المراعي جبنة شدر قابلة للدهن",
		"description": "900 g",
		"price": "4.97",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "جبنة",
		"picture": "Almarai Spreadable Cheddar Cheese",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "المراعي جبنة كريمية قابلة للدهن",
		"description": "900 g",
		"price": "4.99",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "جبنة",
		"picture": "Almarai Spreadable Cream Cheese",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اكتيفيا لبن شراب كامل الدسم",
		"description": "1.75 L",
		"price": "3.05",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "لبن",
		"picture": "Activia Yogurt Drink ",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "المراعي لبن شراب كامل الدسم",
		"description": "2 L",
		"price": "2.25",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "لبن",
		"picture": "Almarai Full Fat Drinking Yogurt",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اكتيفيا لبن شراب قليل الدسم",
		"description": "1.75 L",
		"price": "3.05",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "لبن",
		"picture": "Activia Low Fat Yogurt Drink 1.75",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اليوم شنينة",
		"description": "900 ml",
		"price": "0.95",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "لبن",
		"picture": "Alyoum Shaneeneh",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اكتيفيا لبن شراب كامل الدسم",
		"description": "180 g",
		"price": "0.37",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "لبن",
		"picture": "Activia Yogurt Drink 180 g",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اكتيفيا لبن شراب قليل الدسم",
		"description": "180g",
		"price": "0.37",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "لبن",
		"picture": "Activia Low Fat Yogurt Drink 180 g",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اليوم شنينة",
		"description": "300 g",
		"price": "0.33",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "لبن",
		"picture": "Alyoum Shaneeneh 300 g",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "حمودة لبن بقري",
		"description": "1 Kg",
		"price": "1.13",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "زبادي",
		"picture": "Hammoudeh Yogurt",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اليوم لبن",
		"description": "1.8 kg",
		"price": "2.00",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "زبادي",
		"picture": "Alyoum Yogurt",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اليوم لبن زبادي بالقشطة",
		"description": "200 g",
		"price": "0.57",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "زبادي",
		"picture": "Alyoum Zabadi Yogurt With Cream",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اليوم لبن",
		"description": "200 g",
		"price": "0.25",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "زبادي",
		"picture": "Alyoum Yogurt 200 g",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اليوم لبن",
		"description": "500 g",
		"price": "0.63",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "زبادي",
		"picture": "Alyoum Yogurt 500 g",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "حمودة لبنة بقرية",
		"description": "1 Kg",
		"price": "3.33",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "لبنة",
		"picture": "Hammoudeh Labaneh 1kg",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اليوم لبنة",
		"description": "1 Kg",
		"price": "3.25",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "لبنة",
		"picture": "Alyoum Soft Labaneh 1kg",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "حمودة لبنة بقرية",
		"description": "200 g",
		"price": "0.91",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "لبنة",
		"picture": "Hammoudeh Labaneh 200g",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اليوم لبنة",
		"description": "200 g",
		"price": "0.90",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "لبنة",
		"picture": "Alyoum Labaneh 200g",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "حمودة لبنة بقرية",
		"description": "500 g",
		"price": "1.90",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "لبنة",
		"picture": "Hammoudeh Labaneh 500g",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اليوم لبنة",
		"description": "500 g",
		"price": "1.90",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "لبنة",
		"picture": "Alyoum Labaneh 500g",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "حليبنا زبدة غير مملحة",
		"description": "100 g",
		"price": "0.69",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "زبدة",
		"picture": "Halibna Unsalted Butter 100g",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "حليبنا زبدة غير مملحة",
		"description": "400 g",
		"price": "2.50",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "زبدة",
		"picture": "Halibna Unsalted Butter 400 g",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "جولدينا سمن",
		"description": "200 g",
		"price": "0.75",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "زبدة",
		"picture": "Goldina Margarine 200 g",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "جولدينا زبدة",
		"description": "500 g",
		"price": "1.79",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "زبدة",
		"picture": "Goldina Butter 500g",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "جولدينا زبدة",
		"description": "1 Kg",
		"price": "3.15",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "زبدة",
		"picture": "Goldina Tartine & Cuisson Butter",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "المراعي كريم كراميل",
		"description": "100 g",
		"price": "0.27",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حلوى و بودينج",
		"picture": "Almarai Creme Caramel",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "المراعي حلى الشوكولاتة",
		"description": "85 g",
		"price": "0.27",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حلوى و بودينج",
		"picture": "Almarai Chocolate Dessert",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "المراعي حلى الفانيلا",
		"description": "85 g",
		"price": "0.27",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حلوى و بودينج",
		"picture": "Almarai Vanilla Dessert",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اكتيفيا زبادي مخفوق بالفراولة كامل الدسم",
		"description": "4x120 g",
		"price": "1.35",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حلوى و بودينج",
		"picture": "Activia Full Fat Yogurt Strawberry Flavor",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "اكتيفيا زبادي مخفوق بنكهة المشمش والخوخ كامل الدسم",
		"description": "4x120 g",
		"price": "1.35",
		"catagory": "الأجبان والألبان والبيض",
		"subcatagory": "حلوى و بودينج",
		"picture": "Activia Apricot & Peach Flavored Full Fat Yogurt",
		"englishCat": "Dairy,eggs and cheese"
	},
	{
		"name": "سفن اب مشروب غازي بنكهة الليمون",
		"description": "2 L",
		"price": "0.90",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "المشروبات الغازية",
		"picture": "7 Up Soft Drink Bottle",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "باربيكان شراب الشعير الخالي من الكحول بالنكهة الاصلية",
		"description": "330 ml",
		"price": "0.45",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "المشروبات الغازية",
		"picture": "Barbican Classic Non Alcoholic Malt Beverage",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "باربيكان شراب الشعير الخالي من الكحول بنكهة التوت",
		"description": "330 ml",
		"price": "0.45",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "المشروبات الغازية",
		"picture": "Barbican Non Alcoholic Malt Beverage Raspberry Flavor",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "باربيكان شراب شعير بنكهة الخوخ",
		"description": "330 ml",
		"price": "0.45",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "المشروبات الغازية",
		"picture": "Barbican Peach Flavored Malt Beverage",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "باربيكان شراب الشعير الخالي من الكحول بنكهة الانأناس",
		"description": "330 ml",
		"price": "0.45",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "المشروبات الغازية",
		"picture": "Barbican Non Alcoholic Pineapple Flavored Malt Beverage",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "باربيكان شراب الشعير بنكهة الرمان",
		"description": "330 ml",
		"price": "0.45",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "المشروبات الغازية",
		"picture": "Barbican Non Alcoholic Pomegranate Flavored Malt Beverage",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "باربيكان شراب الشعير الخالي من الكحول بنكهة البطيخ",
		"description": "330 ml",
		"price": "0.45",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "المشروبات الغازية",
		"picture": "Barbican Non Alcoholic Watermelon Flavored Malt Beverage",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "باربيكان شراب شعير خالي من الكحول بنكهة التفاح",
		"description": "330 ml",
		"price": "0.45",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "المشروبات الغازية",
		"picture": "Barbican Non Alcoholic Apple Flavored Malt Beverage",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "باربيكان شراب الشعير الخالي من الكحول بنكهة الفراولة",
		"description": "330 ml",
		"price": "0.45",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "المشروبات الغازية",
		"picture": "Barbican Strawberry Flavored Malt Beverage",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "ميرندا",
		"description": "2 L",
		"price": "0.90",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "المشروبات الغازية",
		"picture": "Mirinda",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "بيبسي مشروب غازي",
		"description": "1 L",
		"price": "0.53",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "المشروبات الغازية",
		"picture": "Pepsi Soft Drink",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "كوكاكولا مشروب غازي",
		"description": "2 L",
		"price": "0.80",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "المشروبات الغازية",
		"picture": "Coca-Cola Soft Drink",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "مسافي عصير تفاح",
		"description": "2 L",
		"price": "2.19",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "عصائر",
		"picture": "Masafi Apple Juice",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "مسافي عصير اناناس",
		"description": "1 L",
		"price": "1.25",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "عصائر",
		"picture": "Masafi Pineapple Juice",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "اليوم عصير فواكه مشكلة",
		"description": "1 L",
		"price": "1.00",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "عصائر",
		"picture": "Alyoum Mixed Berry Nectar",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "المراعي عصير فواكه مشكلة مع فراولة بدون سكر",
		"description": "1.5 L",
		"price": "1.95",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "عصائر",
		"picture": "Almarai Mixed Fruits & Strawberry Juice Without Sugar",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "المراعي عصير توت مشكل",
		"description": "1.5 L",
		"price": "1.47",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "عصائر",
		"picture": "Almarai Mixed Berries Juice",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "اليوم عصير برتقال مع اللب",
		"description": "1.7 L",
		"price": "1.95",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "عصائر",
		"picture": "Alyoum Orange Juice With Pulp",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "اليوم عصير مانجا",
		"description": "1.7 L",
		"price": "1.75",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "عصائر",
		"picture": "Alyoum Mango Juice",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "اليوم عصير فراولة",
		"description": "1.7 L",
		"price": "1.75",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "عصائر",
		"picture": "Alyoum Strawberry Juice",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "اليوم عصير ليمون ونعناع",
		"description": "1.7 L",
		"price": "1.75",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "عصائر",
		"picture": "Alyoum Lemon Juice With Mint",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "مسافي نكتار الفواكه الاستوائية",
		"description": "2 L",
		"price": "2.19",
		"catagory": "مشروبات و عصائر",
		"subcatagory": "عصائر",
		"picture": "Masafi Tropical Fruits Juice",
		"englishCat": "Drinks and juices"
	},
	{
		"name": "البن لوح الحبوب بالفواكة والبندق والشوكولاتة بالحليب",
		"description": "5 ct",
		"price": "2.65",
		"catagory": "إفطار",
		"subcatagory": "ألواح الجرانولا وحبوب الافطار",
		"picture": "Alpen Fruit & Nut Cereal Bar",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "البن لوح الحبوب بالفواكه والبندق",
		"description": "5 ct",
		"price": "2.65",
		"catagory": "إفطار",
		"subcatagory": "ألواح الجرانولا وحبوب الافطار",
		"picture": "Alpen Fruit & Nut With Milk Chocolate Cereal Bar",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "البن لوح الحبوب لايت دبل تشوكلت",
		"description": "5 ct",
		"price": "1.90",
		"catagory": "إفطار",
		"subcatagory": "ألواح الجرانولا وحبوب الافطار",
		"picture": "Alpen Light Chocolate & Fudge Cereal Bar",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "البن لوح الحبوب بالفراولة والزبادي",
		"description": "5 ct",
		"price": "2.10",
		"catagory": "إفطار",
		"subcatagory": "ألواح الجرانولا وحبوب الافطار",
		"picture": "Alpen Strawberry & Yogurt Cereal Bar",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "نايتشر فالي ألواح الجرانولا المقرمشة بالشوفان والعسل",
		"description": "12 ct",
		"price": "2.28",
		"catagory": "إفطار",
		"subcatagory": "ألواح الجرانولا وحبوب الافطار",
		"picture": "Nature Valley Oat & Honey Bars",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "ناتتشر فالي ألواح شوفان المقرمشة مع القرفة",
		"description": "12 ct",
		"price": "2.25",
		"catagory": "إفطار",
		"subcatagory": "ألواح الجرانولا وحبوب الافطار",
		"picture": "Nature Valley Crunchy Oat & Cinnamon",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "نيتشور فالي الواح الشوفان والتفاح المقرمشة",
		"description": "12 ct",
		"price": "2.25",
		"catagory": "إفطار",
		"subcatagory": "ألواح الجرانولا وحبوب الافطار",
		"picture": "Nature Valley Crunchy Oats & Apple Bars",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "نيتشر فالي ألواح الشوفان وجوز الهند المقرمشة",
		"description": "12 ct",
		"price": "2.25",
		"catagory": "إفطار",
		"subcatagory": "ألواح الجرانولا وحبوب الافطار",
		"picture": "Nature Valley Crunchy Oats & Coconut Bars",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "البن ميوسلي التوت والكرز واللوز بدون سكر مضاف",
		"description": "560 g",
		"price": "4.30",
		"catagory": "إفطار",
		"subcatagory": "حبوب إفطار",
		"picture": "Alpen Blueberry, Cherry & Almond Muesli",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "البن موسلي بالشوكولاتة الداكنة ",
		"description": "625 g",
		"price": "5.15",
		"catagory": "إفطار",
		"subcatagory": "حبوب إفطار",
		"picture": "Alpen Dark Chocolate Muesli",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "البين موسلي ستايل سويسري",
		"description": "375 g",
		"price": "3.35",
		"catagory": "إفطار",
		"subcatagory": "حبوب إفطار",
		"picture": "Alpen Swiss Style Muesli Cereal",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "كيلوجز كوكو بوبز رقائق القمح المقرمشة بالشوكولاتة",
		"description": "500 g",
		"price": "5.15",
		"catagory": "إفطار",
		"subcatagory": "حبوب إفطار",
		"picture": "Kellogg'S Coco Pops Crunchy Chocolate Flavor Wheat Cereal",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "كيلوجز كورن فليكس",
		"description": "1 Kg",
		"price": "5.75",
		"catagory": "إفطار",
		"subcatagory": "حبوب إفطار",
		"picture": "Kellogg'S Corn Flakes",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "نستله تشيروز 5 انواع من الحبوب الكاملة المحمصة بالعسل",
		"description": "375 g",
		"price": "3.20",
		"catagory": "إفطار",
		"subcatagory": "حبوب إفطار",
		"picture": "Nestlé Honey Cheerios 5 Whole Grains Cereal",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "بيتي كروكر خليط البانكيك والكريب والوافل",
		"description": "360 g",
		"price": "2.25",
		"catagory": "إفطار",
		"subcatagory": "بانكيك",
		"picture": "",
		"englishCat": ""
	},
	{
		"name": "بيتي كروكر خليط فطائر البانكيك بزبدة الحليب",
		"description": "907 g",
		"price": "2.90",
		"catagory": "إفطار",
		"subcatagory": "بانكيك",
		"picture": "Betty Crocker Buttermilk Pancake Mix",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "كويكر شوفان ابيض سريع الطبخ",
		"description": "500 g",
		"price": "2.39",
		"catagory": "إفطار",
		"subcatagory": "شوفان",
		"picture": "Quaker Quick Cooking White Oats",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "الكسيح حبوب الشوفان الكاملة",
		"description": "300 g",
		"price": "0.92",
		"catagory": "إفطار",
		"subcatagory": "شوفان",
		"picture": "Kasih Whole Oats",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "كسيح الشوفان الأبيض",
		"description": "300 g",
		"price": "0.82",
		"catagory": "إفطار",
		"subcatagory": "شوفان",
		"picture": "Kasih White Oats",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "العلالي مربى مشمش",
		"description": "450 g",
		"price": "1.40",
		"catagory": "إفطار",
		"subcatagory": "مربى",
		"picture": "Al Alali Apricot Jam",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "العلالي مربى فراولة",
		"description": "400 g",
		"price": "1.40",
		"catagory": "إفطار",
		"subcatagory": "مربى",
		"picture": "Al Alali Strawberry Jam",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "العلالي مربى الفاكهة المشكلة",
		"description": "400 g",
		"price": "1.40",
		"catagory": "إفطار",
		"subcatagory": "مربى",
		"picture": "Al Alali Mixed Fruits Jam",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "فيتراك مربى مشمش",
		"description": "900g",
		"price": "1.35",
		"catagory": "إفطار",
		"subcatagory": "مربى",
		"picture": "Vitrac Apricot Jam",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "فيتراك مربى برتقال",
		"description": "900g",
		"price": "1.35",
		"catagory": "إفطار",
		"subcatagory": "مربى",
		"picture": "Vitrac Orange Jam",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "فيتراك مربى الفاكهة المشكلة",
		"description": "900g",
		"price": "1.35",
		"catagory": "إفطار",
		"subcatagory": "مربى",
		"picture": "Vitrac Mixed Fruit Jam",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "كادبوري كريمة الكارميل",
		"description": "400 g",
		"price": "3.75",
		"catagory": "إفطار",
		"subcatagory": "منتجات دهن",
		"picture": "Cadbury Caramel Spread",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "كادبوري كريمة الشوكلاتة بالحليب",
		"description": "400 g",
		"price": "3.99",
		"catagory": "إفطار",
		"subcatagory": "منتجات دهن",
		"picture": "Cadbury Milk Spread Chocolate",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "",
		"description": "750 g",
		"price": "3.99",
		"catagory": "إفطار",
		"subcatagory": "منتجات دهن",
		"picture": "Nutella Hazelnut Spread With Cocoa",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "الكسيح حلاوة شوكولاتة",
		"description": "350 g",
		"price": "1.80",
		"catagory": "إفطار",
		"subcatagory": "حلاوة",
		"picture": "Kasih Spreadable Halva With Chocolate",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "حلواني اخوان النخلة حلاوة سادة",
		"description": "1 Kg",
		"price": "5.73",
		"catagory": "إفطار",
		"subcatagory": "حلاوة",
		"picture": "Halwani Bros Al Nakhla Plain Halva",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "النخلة حلاوة محشية بالفستق الحلبي",
		"description": "1 Kg",
		"price": "6.41",
		"catagory": "إفطار",
		"subcatagory": "حلاوة",
		"picture": "Halwani Bros Al Nakhla Halva Filled With Pistachio",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "حلواني اخوان النخلة حلاوة طحينة فاخرة بالشوكولاتة",
		"description": "1 Kg",
		"price": "7.05",
		"catagory": "إفطار",
		"subcatagory": "حلاوة",
		"picture": "Halwani Bros Al Nakhla Halva With Chocolate",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "حلواني اخوان النخلة حلاوة طحينة فاخرة بالشوكولاتة",
		"description": "250 g",
		"price": "2.55",
		"catagory": "إفطار",
		"subcatagory": "حلاوة",
		"picture": "Halwani Bros Al Nakhla Halva With Chocolate",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "النخلة حلاوة محشية بالفستق الحلبي",
		"description": "250 g",
		"price": "2.29",
		"catagory": "إفطار",
		"subcatagory": "حلاوة",
		"picture": "Halwani Bros Al Nakhla Halva Filled With Pistachio",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "حلاوني النخلة حلاوة طحينية فاخرة سادة",
		"description": "250 g",
		"price": "1.77",
		"catagory": "إفطار",
		"subcatagory": "حلاوة",
		"picture": "Halwani Bros Al Nakhla Plain Halva",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "الباشا حلاوة بالفستق الحلبي",
		"description": "350 g",
		"price": "1.62",
		"catagory": "إفطار",
		"subcatagory": "حلاوة",
		"picture": "Elbasha Halawa With Pistachio",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "الباشا حلاوة بالشوكولاتة",
		"description": "350 g",
		"price": "1.60",
		"catagory": "إفطار",
		"subcatagory": "حلاوة",
		"picture": "Elbasha Halawa With Chocolate",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "الباشا حلاوة سادة",
		"description": "400 g",
		"price": "1.50",
		"catagory": "إفطار",
		"subcatagory": "حلاوة",
		"picture": "El Basha Plain Halva",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "الباشا حلاوة سادة",
		"description": "800 g",
		"price": "2.43",
		"catagory": "إفطار",
		"subcatagory": "حلاوة",
		"picture": "El Basha Plain Halva",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "الباشا حلاوة بالشوكولاتة",
		"description": "800 g",
		"price": "2.70",
		"catagory": "إفطار",
		"subcatagory": "حلاوة",
		"picture": "El Basha Halva With Chocolate",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "الباشا حلاوة بالفستق",
		"description": "800 g",
		"price": "2.80",
		"catagory": "إفطار",
		"subcatagory": "حلاوة",
		"picture": "El Basha Halva With Pistachio",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "الكسيح حلاوة سوبر اكسترا بالمكسرات",
		"description": "900g",
		"price": "4.49",
		"catagory": "إفطار",
		"subcatagory": "حلاوة",
		"picture": "Kasih Halva With Extra Nuts",
		"englishCat": "breakfast and snacks"
	},
	{
		"name": "الغزال طحين متعدد الاستخدامات",
		"description": "1.5 kg",
		"price": "0.75",
		"catagory": "مستلزمات المطبخ",
		"subcatagory": "الدقيق",
		"picture": "Al Ghazal All Purpose Flour",
		"englishCat": "others"
	},
	{
		"name": "مطاحن الجويدة طحين اسمر بلدي",
		"description": "1.5 kg",
		"price": "0.89",
		"catagory": "مستلزمات المطبخ",
		"subcatagory": "الدقيق",
		"picture": "Juwaidah Mills Local Brown Flour",
		"englishCat": "others"
	},
	{
		"name": "عجلون زيت زيتون بكر",
		"description": "4 L",
		"price": "27.75",
		"catagory": "مستلزمات المطبخ",
		"subcatagory": "زيت الزيتون",
		"picture": "Ajloun Virgin Olive Oil",
		"englishCat": "others"
	},
	{
		"name": "عجلون زيت زيتون بكر",
		"description": "900 ml",
		"price": "6.85",
		"catagory": "مستلزمات المطبخ",
		"subcatagory": "زيت الزيتون",
		"picture": "Ajloun Virgin Olive Oil 1L",
		"englishCat": "others"
	},
	{
		"name": "نبالي زيت زيتون بكر ممتاز",
		"description": "750 ml",
		"price": "7.06",
		"catagory": "مستلزمات المطبخ",
		"subcatagory": "زيت الزيتون",
		"picture": "Nabali Extra Virgin Olive Oil",
		"englishCat": "others"
	},
	{
		"name": "نبالي زيت زيتون بكر ممتاز",
		"description": "250 g",
		"price": "2.90",
		"catagory": "مستلزمات المطبخ",
		"subcatagory": "زيت الزيتون",
		"picture": "Nabali Extra Virgin Olive Oil",
		"englishCat": "others"
	},
	{
		"name": "مازولا زيت دوار الشمس",
		"description": "9 L",
		"price": "14.10",
		"catagory": "مستلزمات المطبخ",
		"subcatagory": "زيت الزيتون",
		"picture": "Mazola Sunflower Oil",
		"englishCat": "others"
	},
	{
		"name": "عافية زيت الذرة",
		"description": "9 L",
		"price": "14.21",
		"catagory": "مستلزمات المطبخ",
		"subcatagory": "زيت الزيتون",
		"picture": "Afia Corn Oil",
		"englishCat": "others"
	},
	{
		"name": "مازولا زيت ذرة",
		"description": "9 L",
		"price": "15.45",
		"catagory": "مستلزمات المطبخ",
		"subcatagory": "زيت الزيتون",
		"picture": "Mazola Corn Oil",
		"englishCat": "others"
	},
	{
		"name": "مازولا زيت دوار الشمس",
		"description": "1.8 L",
		"price": "2.80",
		"catagory": "مستلزمات المطبخ",
		"subcatagory": "زيت الزيتون",
		"picture": "Mazola Sunflower oil  1.8L",
		"englishCat": "others"
	},
	{
		"name": "عافية زيت الذرة",
		"description": "1.5 L",
		"price": "2.65",
		"catagory": "مستلزمات المطبخ",
		"subcatagory": "زيت الزيتون",
		"picture": "Afia Pure Corn Oil 1.5L",
		"englishCat": "others"
	},
	{
		"name": "عافية زيت دوار الشمس الصافي",
		"description": "1.5 L",
		"price": "2.35",
		"catagory": "مستلزمات المطبخ",
		"subcatagory": "زيت الزيتون",
		"picture": "Afia Pure Sunflower Oil 1.5L",
		"englishCat": "others"
	},
	{
		"name": "مازولا زيت ذرة",
		"description": "1.8 L",
		"price": "3.10",
		"catagory": "مستلزمات المطبخ",
		"subcatagory": "زيت الزيتون",
		"picture": "Mazola Corn Oil 1.8L",
		"englishCat": "others"
	},
	{
		"name": "الأسرة سكر ناعم",
		"description": "10.5 kg",
		"price": "4.38",
		"catagory": "مستلزمات المطبخ",
		"subcatagory": "سكر",
		"picture": "Al Osra Fine Sugar",
		"englishCat": "others"
	},
	{
		"name": "الاسرة سكر بني",
		"description": "500 g",
		"price": "0.99",
		"catagory": "مستلزمات المطبخ",
		"subcatagory": "سكر",
		"picture": "Al Osra Natural Brown Sugar",
		"englishCat": "others"
	},
	{
		"name": "الأسرة سكر ناعم",
		"description": "2 kg",
		"price": "0.93",
		"catagory": "مستلزمات المطبخ",
		"subcatagory": "سكر",
		"picture": "Al Osra Fine Sugar 2Kg",
		"englishCat": "others"
	},
	{
		"name": "ملح الزهرة",
		"description": "750 g",
		"price": "0.16",
		"catagory": "مستلزمات المطبخ",
		"subcatagory": "ملح",
		"picture": "Al-Zahra Salt",
		"englishCat": "others"
	},
	{
		"name": "ملح عمره",
		"description": "700 g",
		"price": "0.29",
		"catagory": "مستلزمات المطبخ",
		"subcatagory": "ملح",
		"picture": "Amra Iodized Fine Table Salt",
		"englishCat": "others"
	},
	{
		"name": "خبز عربي ابيض",
		"description": "1 Kg",
		"price": "0.40",
		"catagory": "المخبز",
		"subcatagory": "خبز",
		"picture": "Medium Arabic Bread",
		"englishCat": "bread and bakery"
	},
	{
		"name": "خبز عربي اسمر",
		"description": "1 Kg",
		"price": "0.40",
		"catagory": "المخبز",
		"subcatagory": "خبز",
		"picture": "Medium  Brown Arabic Bread",
		"englishCat": "bread and bakery"
	},
	{
		"name": "خبز توست هرفي اسمر",
		"description": "600 g",
		"price": "1.33",
		"catagory": "المخبز",
		"subcatagory": "خبز",
		"picture": "Herfy Sliced Brown Toast Bread",
		"englishCat": "bread and bakery"
	},
	{
		"name": "خبز توست هرفي ابيض",
		"description": "600 g",
		"price": "1.33",
		"catagory": "المخبز",
		"subcatagory": "خبز",
		"picture": "Herfy Sliced white Toast Bread",
		"englishCat": "bread and bakery"
	},
	{
		"name": "اير ويك معطر جو لافندر",
		"description": "300 ml",
		"price": "2.59",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "معطرات الجو",
		"picture": "Air Wick Air Freshener Aerosol Lavender",
		"englishCat": "household"
	},
	{
		"name": "اير ويك معطر جو برائحة ورد الكرز",
		"description": "300 ml",
		"price": "2.59",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "معطرات الجو",
		"picture": "Air Wick Cherry Flowers Air Freshener",
		"englishCat": "household"
	},
	{
		"name": "بونو معطر جو برائحة التوت والفراولة",
		"description": "500 ml",
		"price": "0.99",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "معطرات الجو",
		"picture": "Bono Berries Scent Air Freshener",
		"englishCat": "household"
	},
	{
		"name": "بونو معطر جو برائحة الكراميل",
		"description": "500 ml",
		"price": "0.99",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "معطرات الجو",
		"picture": "Bono Caramel Scented Air Freshener",
		"englishCat": "household"
	},
	{
		"name": "ديتول معقم و مطهر",
		"description": "4 L",
		"price": "23.95",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منظفات متعددة الاستعمالات",
		"picture": "Dettol Antiseptic Disinfectant",
		"englishCat": "household"
	},
	{
		"name": "ديتول منظف متعدد الاستعمالات برائحة الياسمين",
		"description": "1.8 L",
		"price": "6.30",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منظفات متعددة الاستعمالات",
		"picture": "Dettol Jasmine Healthy Home All- Purpose Cleaner",
		"englishCat": "household"
	},
	{
		"name": "ديتول مطهر ومعقم ومنظف",
		"description": "1 L",
		"price": "6.27",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منظفات متعددة الاستعمالات",
		"picture": "Dettol Antiseptic & Disinfectant Detergent",
		"englishCat": "household"
	},
	{
		"name": "ديتول بخاخ منظف الاسطح المضاد للبكتيريا",
		"description": "500 ml",
		"price": "3.95",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منظفات متعددة الاستعمالات",
		"picture": "Dettol Antibacterial Surface Cleanser Spray",
		"englishCat": "household"
	},
	{
		"name": "العملاق جرين كلين مطهر عام ومعقم برائحة نسيم البحر",
		"description": "3 L",
		"price": "3.35",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منظفات متعددة الاستعمالات",
		"picture": "Al Emlaq Green Clean Ocean Breeze Scented Disinfctant & Freshener",
		"englishCat": "household"
	},
	{
		"name": "بونو معطر عام للأرضيات والأسطح برائحة زهور البنفسج",
		"description": "700 ml",
		"price": "0.97",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منظفات متعددة الاستعمالات",
		"picture": "",
		"englishCat": ""
	},
	{
		"name": "بونو معطر عام للأرضيات برائحة بوكيه الورد",
		"description": "700 ml",
		"price": "0.97",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منظفات متعددة الاستعمالات",
		"picture": "",
		"englishCat": ""
	},
	{
		"name": "اجاكس منظف متعدد الاستعمالات",
		"description": "500 ml",
		"price": "1.95",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منظفات متعددة الاستعمالات",
		"picture": "Ajax Multi Purpose Cleaner",
		"englishCat": "household"
	},
	{
		"name": "كلوركس الاصلي مبيض ينظف ويطهر",
		"description": "950 ml",
		"price": "0.77",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منظفات متعددة الاستعمالات",
		"picture": "Clorox Original Cleans & Disinfects Bleach",
		"englishCat": "household"
	},
	{
		"name": "افكو تونا بيضاء لايت",
		"description": "170 g",
		"price": "0.95",
		"catagory": "المعلبات",
		"subcatagory": "المأكولات البحرية المعلبة",
		"picture": "Affco Light Meat Tuna",
		"englishCat": "canned food"
	},
	{
		"name": "افكو قطع لحم التونا الحار لايت",
		"description": "170 g",
		"price": "0.65",
		"catagory": "المعلبات",
		"subcatagory": "المأكولات البحرية المعلبة",
		"picture": "Affco Light Meat Tuna Chunks In Chili",
		"englishCat": "canned food"
	},
	{
		"name": "افكو تونا بزيت الزيتون لايت",
		"description": "170 g",
		"price": "0.65",
		"catagory": "المعلبات",
		"subcatagory": "المأكولات البحرية المعلبة",
		"picture": "Affco Light Meat Tuna In Olive Oil",
		"englishCat": "canned food"
	},
	{
		"name": "العلالي تونا بزيت الزيتون",
		"description": "170 g",
		"price": "1.27",
		"catagory": "المعلبات",
		"subcatagory": "المأكولات البحرية المعلبة",
		"picture": "Al Alali White Tuna In Water",
		"englishCat": "canned food"
	},
	{
		"name": "العلالي تونا بزيت الزيتون",
		"description": "195 g",
		"price": "1.27",
		"catagory": "المعلبات",
		"subcatagory": "المأكولات البحرية المعلبة",
		"picture": "Al Alali Fancy Meat Tuna In Olive Oil",
		"englishCat": "canned food"
	},
	{
		"name": "العلالي تونا بزبت دوار الشمس",
		"description": "195 g",
		"price": "1.30",
		"catagory": "المعلبات",
		"subcatagory": "المأكولات البحرية المعلبة",
		"picture": "Al Alali Fancy Meat Tuna In Sunflower Oil",
		"englishCat": "canned food"
	},
	{
		"name": "صني سي سردين حار بالزيت النباتي",
		"description": "125 g",
		"price": "0.49",
		"catagory": "المعلبات",
		"subcatagory": "المأكولات البحرية المعلبة",
		"picture": "Sunny Sea Sardines In Vegetable Oil & Chili",
		"englishCat": "canned food"
	},
	{
		"name": "بوستمان سردين بالزيت النباتي",
		"description": "125 g",
		"price": "0.39",
		"catagory": "المعلبات",
		"subcatagory": "المأكولات البحرية المعلبة",
		"picture": "Postman Sardines In Vegetable Oil",
		"englishCat": "canned food"
	},
	{
		"name": "إكستر كورنيد لحم البقر",
		"description": "340 g",
		"price": "1.95",
		"catagory": "المعلبات",
		"subcatagory": "اللحوم المعلبة",
		"picture": "Exeter Corned Beef",
		"englishCat": "canned food"
	},
	{
		"name": "سنيورة القدس هوت دوغ بقري",
		"description": "450 g",
		"price": "0.86",
		"catagory": "المعلبات",
		"subcatagory": "اللحوم المعلبة",
		"picture": "Siniora Al Quds Beef Hot Dog",
		"englishCat": "canned food"
	},
	{
		"name": "سنيورة القدس هوت دوغ دجاج",
		"description": "415 G",
		"price": "0.85",
		"catagory": "المعلبات",
		"subcatagory": "اللحوم المعلبة",
		"picture": "Siniora Al Quds Chicken Hot Dog",
		"englishCat": "canned food"
	},
	{
		"name": "هاينز فاصوليا باربكيو",
		"description": "390 g",
		"price": "1.10",
		"catagory": "المعلبات",
		"subcatagory": "فول و فصوليا جاهزة",
		"picture": "Heinz Beanz Barbecue",
		"englishCat": "canned food"
	},
	{
		"name": "هاينز فاصوليا مطبوخة بالكاري",
		"description": "390 g",
		"price": "1.10",
		"catagory": "المعلبات",
		"subcatagory": "فول و فصوليا جاهزة",
		"picture": "Heinz Baked Beans Curry",
		"englishCat": "canned food"
	},
	{
		"name": "هينز فاصوليا 5 انواع",
		"description": "415 G",
		"price": "1.70",
		"catagory": "المعلبات",
		"subcatagory": "فول و فصوليا جاهزة",
		"picture": "Heinz Five Beanz",
		"englishCat": "canned food"
	},
	{
		"name": "لونا فاصوليا مطبوخة بصلصة الطماطم",
		"description": "400 g",
		"price": "0.44",
		"catagory": "المعلبات",
		"subcatagory": "فول و فصوليا جاهزة",
		"picture": "Luna Baked Beans In Tomato Sauce",
		"englishCat": "canned food"
	},
	{
		"name": "لونا فول مدمس",
		"description": "400 g",
		"price": "0.44",
		"catagory": "المعلبات",
		"subcatagory": "فول و فصوليا جاهزة",
		"picture": "Luna Foul Medames",
		"englishCat": "canned food"
	},
	{
		"name": "اميريكانا فول بالحمص و زيت الزيتون جاهز للاكل",
		"description": "400 g",
		"price": "0.44",
		"catagory": "المعلبات",
		"subcatagory": "فول و فصوليا جاهزة",
		"picture": "Americana Fava Beans Ready To Eat With Chickpeas & Olive Oil",
		"englishCat": "canned food"
	},
	{
		"name": "اميريكان جاردن حمص حب",
		"description": "400 g",
		"price": "0.65",
		"catagory": "المعلبات",
		"subcatagory": "فول و فصوليا جاهزة",
		"picture": "American Garden Chickpeas",
		"englishCat": "canned food"
	},
	{
		"name": "باريلا معكرونة لازانيا كولزيوني",
		"description": "500 g",
		"price": "2.77",
		"catagory": "الأطعمة الجافة والمعكرونة",
		"subcatagory": "المعكرونة",
		"picture": "Barilla Collezione Lasagne Pasta",
		"englishCat": "pasta and rice"
	},
	{
		"name": "باريلا تاغلياتيلي بولونيزي معكرونة",
		"description": "500 g",
		"price": "2.29",
		"catagory": "الأطعمة الجافة والمعكرونة",
		"subcatagory": "المعكرونة",
		"picture": "Barilla Tagliatelle Bolognesi Macaroni",
		"englishCat": "pasta and rice"
	},
	{
		"name": "باريلا معكرونة فيتوشيني توسكاني",
		"description": "500 g",
		"price": "2.29",
		"catagory": "الأطعمة الجافة والمعكرونة",
		"subcatagory": "المعكرونة",
		"picture": "Barilla Fettuccine Toscane Pasta",
		"englishCat": "pasta and rice"
	},
	{
		"name": "الغزال معكرونة لنجويني",
		"description": "300 g",
		"price": "0.32",
		"catagory": "الأطعمة الجافة والمعكرونة",
		"subcatagory": "المعكرونة",
		"picture": "Al-Ghazal Linguine Macaroni",
		"englishCat": "pasta and rice"
	},
	{
		"name": "الغزال معكرونة تويست",
		"description": "300 g",
		"price": "0.32",
		"catagory": "الأطعمة الجافة والمعكرونة",
		"subcatagory": "المعكرونة",
		"picture": "Al-Ghazal Twisted Macaroni",
		"englishCat": "pasta and rice"
	},
	{
		"name": "الغزال معكرونة كافاتابي",
		"description": "300 g",
		"price": "0.32",
		"catagory": "الأطعمة الجافة والمعكرونة",
		"subcatagory": "المعكرونة",
		"picture": "Al-Ghazal Cavatappi Pasta",
		"englishCat": "pasta and rice"
	},
	{
		"name": "ابو كاس ارز هندي بسمتي",
		"description": "4.5 kg",
		"price": "5.19",
		"catagory": "الأطعمة الجافة والمعكرونة",
		"subcatagory": "الأرز",
		"picture": "Abu Kass Indian Basmati Rice",
		"englishCat": "pasta and rice"
	},
	{
		"name": "أبو بنت أرز أمريكي طويل الحبة",
		"description": "5 kg",
		"price": "4.87",
		"catagory": "الأطعمة الجافة والمعكرونة",
		"subcatagory": "الأرز",
		"picture": "Abu Bint American Long Grain Rice",
		"englishCat": "pasta and rice"
	},
	{
		"name": "تايجر ارز امريكي حبة متوسطة",
		"description": "4 kg",
		"price": "4.15",
		"catagory": "الأطعمة الجافة والمعكرونة",
		"subcatagory": "الأرز",
		"picture": "Tiger California Rice",
		"englishCat": "pasta and rice"
	},
	{
		"name": "فيليه صدر دجاج بيبي",
		"description": "1 Kg",
		"price": "4.99",
		"catagory": "اللحوم والدواجن ",
		"subcatagory": "الدجاج الطازج",
		"picture": "Baby Chicken Breast Fillet",
		"englishCat": "meat and chicken"
	},
	{
		"name": "أفخاذ دجاج بيبي بدون عظم",
		"description": "1 Kg",
		"price": "2.99",
		"catagory": "اللحوم والدواجن ",
		"subcatagory": "الدجاج الطازج",
		"picture": "Boneless Baby Chicken Thighs",
		"englishCat": "meat and chicken"
	},
	{
		"name": "حمودة دجاج كامل جامبو",
		"description": "1 Kg",
		"price": "1.89",
		"catagory": "اللحوم والدواجن ",
		"subcatagory": "الدجاج الطازج",
		"picture": "Hammoudeh Jumbo Whole Chicken",
		"englishCat": "meat and chicken"
	},
	{
		"name": "نبيل روست اقتصادي",
		"description": "500 g",
		"price": "1.97",
		"catagory": "اللحوم والدواجن ",
		"subcatagory": "الدجاج الطازج",
		"picture": "Nabil Economy Roast",
		"englishCat": "meat and chicken"
	},
	{
		"name": "سنيورة شرائح مرتديلا دجاج بالزيتون",
		"description": "200 g",
		"price": "0.80",
		"catagory": "اللحوم والدواجن ",
		"subcatagory": "الدجاج الطازج",
		"picture": "Siniora Plain Chicken Mortadella Slices",
		"englishCat": "meat and chicken"
	},
	{
		"name": "سنيورة شرائح مرتديلا حبش بالفلفل",
		"description": "200 g",
		"price": "0.80",
		"catagory": "اللحوم والدواجن ",
		"subcatagory": "الدجاج الطازج",
		"picture": "Siniora Turkey Mortadella Slices With Pepper",
		"englishCat": "meat and chicken"
	},
	{
		"name": "لحمة مفرومة عجل برازيلي قليلة الدسم",
		"description": "1 Kg",
		"price": "5.99",
		"catagory": "اللحوم والدواجن ",
		"subcatagory": "اللحوم الطازجة",
		"picture": "Low Fat Minced Brazilian Beef Meat Young",
		"englishCat": "meat and chicken"
	},
	{
		"name": "لحمة خاروف مفرومة",
		"description": "1 Kg",
		"price": "5.99",
		"catagory": "اللحوم والدواجن ",
		"subcatagory": "اللحوم الطازجة",
		"picture": "Minced Lamb Meat",
		"englishCat": "meat and chicken"
	},
	{
		"name": "لحمة مفرومة عجل بلدي",
		"description": "1 Kg",
		"price": "6.99",
		"catagory": "اللحوم والدواجن ",
		"subcatagory": "اللحوم الطازجة",
		"picture": "Minced Local Beef Meat",
		"englishCat": "meat and chicken"
	},
	{
		"name": "جونسونز بيبي شامبو وبلسم للاطفال 2 في 1",
		"description": "200 ml",
		"price": "1.90",
		"catagory": "احتياجات الأطفال",
		"subcatagory": "حمام الطفل والعناية بالجسم",
		"picture": "Johnson'S Baby 2 In 1 Shampoo & Conditioner",
		"englishCat": "baby care"
	},
	{
		"name": "جونسونز سائل استحمام للأطفال",
		"description": "500 ml",
		"price": "3.15",
		"catagory": "احتياجات الأطفال",
		"subcatagory": "حمام الطفل والعناية بالجسم",
		"picture": "Johnson'S Baby Bath",
		"englishCat": "baby care"
	},
	{
		"name": "جونسون زيت اطفال ما قبل النوم",
		"description": "300 ml",
		"price": "4.35",
		"catagory": "احتياجات الأطفال",
		"subcatagory": "حمام الطفل والعناية بالجسم",
		"picture": "Johnson'S Baby Bedtime Oil",
		"englishCat": "baby care"
	},
	{
		"name": "جونسونز بودرة اطفال",
		"description": "500 g",
		"price": "4.17",
		"catagory": "احتياجات الأطفال",
		"subcatagory": "حمام الطفل والعناية بالجسم",
		"picture": "Johnson'S Baby Powder",
		"englishCat": "baby care"
	},
	{
		"name": "جونسونز بيبي لوشن",
		"description": "300 ml",
		"price": "2.79",
		"catagory": "احتياجات الأطفال",
		"subcatagory": "حمام الطفل والعناية بالجسم",
		"picture": "Johnson'S Baby Lotion",
		"englishCat": "baby care"
	},
	{
		"name": "جونسون زيت اطفال ما قبل النوم",
		"description": "300 ml",
		"price": "3.90",
		"catagory": "احتياجات الأطفال",
		"subcatagory": "حمام الطفل والعناية بالجسم",
		"picture": "Johnson'S Baby Oil",
		"englishCat": "baby care"
	},
	{
		"name": "بامبرز بيبي دراي حفاضات حجم 6 اكس اكس لارج (13+ كغ)",
		"description": "48 ct",
		"price": "12.55",
		"catagory": "احتياجات الأطفال",
		"subcatagory": "الحفاضات ومناديل الأطفال",
		"picture": "Pampers Baby-Dry Size 6 Xx-Large Diapers (13+ Kg)",
		"englishCat": "baby care"
	},
	{
		"name": "بامبرز حفاضات ميدي حجم 3 ( 4 - 9 كغم )",
		"description": "80 ct",
		"price": "12.29",
		"catagory": "احتياجات الأطفال",
		"subcatagory": "الحفاضات ومناديل الأطفال",
		"picture": "Pampers Diapers Midi Size 3 ( 4 - 9 Kg)",
		"englishCat": "baby care"
	},
	{
		"name": "بامبرز حفاضات ماكسي حجم 4 ( 7 - 18 كغم)",
		"description": "80 ct",
		"price": "12.29",
		"catagory": "احتياجات الأطفال",
		"subcatagory": "الحفاضات ومناديل الأطفال",
		"picture": "Pampers Diapers Maxi Size 4 ( 7 -18 Kg)",
		"englishCat": "baby care"
	},
	{
		"name": "بامبرز بريميوم كير حفاضات حجم 1 (2-5 كغ)",
		"description": "50 ct",
		"price": "7.19",
		"catagory": "احتياجات الأطفال",
		"subcatagory": "الحفاضات ومناديل الأطفال",
		"picture": "Pampers Premium Care Diapers Size 1 (2-5 Kg)",
		"englishCat": "baby care"
	},
	{
		"name": "بيبي لايف حفاضات حجم 2 (3-6 كغ)",
		"description": "56 ct",
		"price": "4.93",
		"catagory": "احتياجات الأطفال",
		"subcatagory": "الحفاضات ومناديل الأطفال",
		"picture": "Baby Life Diapers Size 2 (3-6 Kg)",
		"englishCat": "baby care"
	},
	{
		"name": "اكس افريكا مزيل عرق وبخاخ للجسم للرجال",
		"description": "150 ml",
		"price": "1.62",
		"catagory": "العناية الشخصية",
		"subcatagory": "مزيلات ومضادات التعرق",
		"picture": "AXE Africa Deodorant & Body Spray For Men",
		"englishCat": "personal care"
	},
	{
		"name": "اكس ألاسكا مزيل عرق وبخاخ للجسم منعش للرجال",
		"description": "150 ml",
		"price": "1.62",
		"catagory": "العناية الشخصية",
		"subcatagory": "مزيلات ومضادات التعرق",
		"picture": "AXE ِAlaska Fresh Deodorant & Body Spray For Men",
		"englishCat": "personal care"
	},
	{
		"name": "اكس مزيل عرق اناركي",
		"description": "150 ml",
		"price": "1.62",
		"catagory": "العناية الشخصية",
		"subcatagory": "مزيلات ومضادات التعرق",
		"picture": "Axe Anarchy Deodorant Spray",
		"englishCat": "personal care"
	},
	{
		"name": "اكس ابولو مزيل عرق وبخاخ للجسم للرجال",
		"description": "150 ml",
		"price": "1.62",
		"catagory": "العناية الشخصية",
		"subcatagory": "مزيلات ومضادات التعرق",
		"picture": "Axe Apollo Deodorant & Body Spray For Men",
		"englishCat": "personal care"
	},
	{
		"name": "اكس مارين مزيل عرق و معطر للجسم منعش",
		"description": "150 ml",
		"price": "1.62",
		"catagory": "العناية الشخصية",
		"subcatagory": "مزيلات ومضادات التعرق",
		"picture": "Axe Marine Fresh Deodorant & Body Spray",
		"englishCat": "personal care"
	},
	{
		"name": "اكس اكسايت مزيل عرق وبخاخ للجسم للرجال",
		"description": "150 ml",
		"price": "1.62",
		"catagory": "العناية الشخصية",
		"subcatagory": "مزيلات ومضادات التعرق",
		"picture": "AXE Excite Deodorant & Body Spray For Men",
		"englishCat": "personal care"
	},
	{
		"name": "اكس يو مزيل عرق و بخاخ للجسم",
		"description": "150 ml",
		"price": "1.62",
		"catagory": "العناية الشخصية",
		"subcatagory": "مزيلات ومضادات التعرق",
		"picture": "Axe You Deodorant & Body Spray",
		"englishCat": "personal care"
	},
	{
		"name": "ليدي سبيد ستيك بخاخ مزيل رائحة العرق بالصبار",
		"description": "150 ml",
		"price": "2.50",
		"catagory": "العناية الشخصية",
		"subcatagory": "مزيلات ومضادات التعرق",
		"picture": "Lady Speed Stick Aloe Protection Deodorant Spray",
		"englishCat": "personal care"
	},
	{
		"name": "ليدي سبيد ستيك مزيل عرق بخاخ فريش اند اسينس",
		"description": "150 ml",
		"price": "2.45",
		"catagory": "العناية الشخصية",
		"subcatagory": "مزيلات ومضادات التعرق",
		"picture": "Lady Speed Stick Fresh & Essence Anti-Perspirant",
		"englishCat": "personal care"
	},
	{
		"name": "ليدي سبيد ستيك مزيل عرق فريش اند اسينس",
		"description": "150 ml",
		"price": "2.45",
		"catagory": "العناية الشخصية",
		"subcatagory": "مزيلات ومضادات التعرق",
		"picture": "Lady Speed Stick Fresh & Essence Deodorant Spray",
		"englishCat": "personal care"
	},
	{
		"name": "ليدي سبيد ستيك مضاد للعرق فريش فيوجن",
		"description": "45 g",
		"price": "2.20",
		"catagory": "العناية الشخصية",
		"subcatagory": "مزيلات ومضادات التعرق",
		"picture": "Lady Speed Stick Fresh Fusion Antiperspirant",
		"englishCat": "personal care"
	},
	{
		"name": "ليدي سبيد ستيك فريش اند اسينس مزيل عرق للنساء",
		"description": "39.6 g",
		"price": "3.20",
		"catagory": "العناية الشخصية",
		"subcatagory": "مزيلات ومضادات التعرق",
		"picture": "Lady Speed Stick Fresh & Essence Wild Freesia Women Deodorant",
		"englishCat": "personal care"
	},
	{
		"name": "ليدي سبيد ستيك شاور فريش مزيل عرق",
		"description": "65 g",
		"price": "3.20",
		"catagory": "العناية الشخصية",
		"subcatagory": "مزيلات ومضادات التعرق",
		"picture": "Lady Speed Stick Orchard Blossom Scented Deodorant",
		"englishCat": "personal care"
	},
	{
		"name": "سبيد ستيك جل مضاد للتعرق كول فيوجن",
		"description": "85 g",
		"price": "3.70",
		"catagory": "العناية الشخصية",
		"subcatagory": "مزيلات ومضادات التعرق",
		"picture": "Speed Stick Cool Fusion Deodorant For Men",
		"englishCat": "personal care"
	},
	{
		"name": "سبيد ستيك كول فيوجن مزيل عرق جل للرجال",
		"description": "85 g",
		"price": "2.30",
		"catagory": "العناية الشخصية",
		"subcatagory": "مزيلات ومضادات التعرق",
		"picture": "Speed Stick Cool Fusion Men Deodorant Gel",
		"englishCat": "personal care"
	},
	{
		"name": "هيد آند شولدرز شامبو ضد القشرة 2 في 1 لشعر نظيف و انيق",
		"description": "900 ml",
		"price": "5.95",
		"catagory": "العناية الشخصية",
		"subcatagory": "شامبو و بلسم ٢ و ١",
		"picture": "Head & Shoulders Classic Clean 2 In 1 Antidandruff Shampoo",
		"englishCat": "personal care"
	},
	{
		"name": "بانتين برو في شامبو و بلسم 2 في 1 لشعر صحي ونظيف",
		"description": "1 L",
		"price": "4.47",
		"catagory": "العناية الشخصية",
		"subcatagory": "شامبو و بلسم ٢ و ١",
		"picture": "Pantene Pro-V Daily Care 2In1 Shampoo & Conditioner",
		"englishCat": "personal care"
	},
	{
		"name": "كلير شامبو وبلسم مضاد للقشرة ناعم ولامع",
		"description": "600 ml",
		"price": "4.25",
		"catagory": "العناية الشخصية",
		"subcatagory": "شامبو و بلسم ٢ و ١",
		"picture": "Clear Anti-Dandruff Soft & Shiny Shampoo And Conditioner",
		"englishCat": "personal care"
	},
	{
		"name": "كلير شامبو وبلسم مضاد لتساقط الشعر ومضاد للقشرة",
		"description": "400 ml",
		"price": "4.25",
		"catagory": "العناية الشخصية",
		"subcatagory": "شامبو و بلسم ٢ و ١",
		"picture": "Clear Anti Hair Fall And Anti-Dandruff Shampoo And Conditioner",
		"englishCat": "personal care"
	},
	{
		"name": "كاميو صابون سائل مرطب لغسل اليدين برائحة البحر",
		"description": "3.5 L+500 ml",
		"price": "4.49",
		"catagory": "العناية الشخصية",
		"subcatagory": "صابون يدين",
		"picture": "Cameo Blue Marine Scented Moisturizing Liquid Hand Wash",
		"englishCat": "personal care"
	},
	{
		"name": "كاميو صابون سائل مرطب لغسل اليدين برائحة جوز الهند",
		"description": "3.5 L+500 ml",
		"price": "4.49",
		"catagory": "العناية الشخصية",
		"subcatagory": "صابون يدين",
		"picture": "Cameo Coconut Milk Scented Moisturizing Liquid Hand Wash",
		"englishCat": "personal care"
	},
	{
		"name": "كاميو صابون سائل مرطب لغسل اليدين برائحة الورد",
		"description": "3.5 L+500 ml",
		"price": "4.98",
		"catagory": "العناية الشخصية",
		"subcatagory": "صابون يدين",
		"picture": "Cameo Floral Scented Moisturizing Liquid Hand Wash",
		"englishCat": "personal care"
	},
	{
		"name": "كاميو صابون سائل مرطب لغسل اليدين برائحة الفواكه الاستوائية",
		"description": "3.5 L+500 ml",
		"price": "4.98",
		"catagory": "العناية الشخصية",
		"subcatagory": "صابون يدين",
		"picture": "Cameo Tropical Fruits Scented Moisturizing Liquid Hand Wash",
		"englishCat": "personal care"
	},
	{
		"name": "كاميو صابون سائل مرطب لغسل اليدين برائحة الشاي الأخضر + صابون لغسل اليدين برائحة البلو مارين",
		"description": "3.5 L+500 ml",
		"price": "4.49",
		"catagory": "العناية الشخصية",
		"subcatagory": "صابون يدين",
		"picture": "Cameo Green Tea Scented Moisturizing Liquid Hand Wash + Blue Marine Scented Hand Wash",
		"englishCat": "personal care"
	},
	{
		"name": "هاي جين سائل لغسيل اليدين برائحة زهور البرتقال",
		"description": "500 ml",
		"price": "1.25",
		"catagory": "العناية الشخصية",
		"subcatagory": "صابون يدين",
		"picture": "Higeen Orange Blossom Scented Hand & Body Wash",
		"englishCat": "personal care"
	},
	{
		"name": "هاي جين سائل لغسيل اليدين و الجسم برائحة الفواكة",
		"description": "500 ml",
		"price": "1.25",
		"catagory": "العناية الشخصية",
		"subcatagory": "صابون يدين",
		"picture": "Higeen Fruity Scented Hand & Body Wash",
		"englishCat": "personal care"
	},
	{
		"name": "كاميو صابون سائل مرطب لغسل اليدين برائحة الورد",
		"description": "500 ml",
		"price": "0.91",
		"catagory": "العناية الشخصية",
		"subcatagory": "صابون يدين",
		"picture": "Cameo Floral Scented Moisturizing Liquid Hand Wash small",
		"englishCat": "personal care"
	},
	{
		"name": "كاميو صابون سائل مرطب لغسل اليدين برائحة البحر",
		"description": "500 ml",
		"price": "0.97",
		"catagory": "العناية الشخصية",
		"subcatagory": "صابون يدين",
		"picture": "Cameo Blue Marine Scented Moisturizing Liquid Hand Wash small",
		"englishCat": "personal care"
	},
	{
		"name": "كولجيت اوبتك وايت معجون اسنان مبيض",
		"description": "75 ml",
		"price": "7.99",
		"catagory": "العناية الشخصية",
		"subcatagory": "معجون الاسنان",
		"picture": "Colgate Optic White Expert White Toothpaste",
		"englishCat": "personal care"
	},
	{
		"name": "كولجيت برو ريليف معجون للاصلاح والحماية للاسنان الحساسة",
		"description": "75 ml",
		"price": "7.19",
		"catagory": "العناية الشخصية",
		"subcatagory": "معجون الاسنان",
		"picture": "Colgate Sensitive Pro Relief Repair & Prevent Toothpaste",
		"englishCat": "personal care"
	},
	{
		"name": "سنسوداين ترو وايت اكسترا فريش معجون أسنان",
		"description": "75 ml",
		"price": "6.75",
		"catagory": "العناية الشخصية",
		"subcatagory": "معجون الاسنان",
		"picture": "Sensodyne True White Extra Fresh Toothpaste",
		"englishCat": "personal care"
	},
	{
		"name": "كولجيت معجون اسنان حماية قسوى",
		"description": "125 ml",
		"price": "1.20",
		"catagory": "العناية الشخصية",
		"subcatagory": "معجون الاسنان",
		"picture": "Colgate Maximum Cavity Protection Toothpaste",
		"englishCat": "personal care"
	},
	{
		"name": "كولجيت معجون اسنان بالاعشاب",
		"description": "200 ml",
		"price": "1.10",
		"catagory": "العناية الشخصية",
		"subcatagory": "معجون الاسنان",
		"picture": "Colgate Herbal Toothpaste",
		"englishCat": "personal care"
	},
	{
		"name": "كرست معجون اسنان",
		"description": "155 g",
		"price": "1.05",
		"catagory": "العناية الشخصية",
		"subcatagory": "معجون الاسنان",
		"picture": "Crest Toothpaste",
		"englishCat": "personal care"
	},
	{
		"name": "ليسترين غسول ومطهر الفم بالنعناع",
		"description": "500 ml",
		"price": "5.70",
		"catagory": "العناية الشخصية",
		"subcatagory": "معقم فم",
		"picture": "Listerine Teeth & Gum Antiseptic Mouth Wash",
		"englishCat": "personal care"
	},
	{
		"name": "كولجيت اوبتك وايت غسول للفم",
		"description": "500 ml",
		"price": "5.69",
		"catagory": "العناية الشخصية",
		"subcatagory": "معقم فم",
		"picture": "Colgate Mouthwash Optic White",
		"englishCat": "personal care"
	},
	{
		"name": "لسترين فريش بيرست غسول الفم ومطهر",
		"description": "500 ml",
		"price": "5.20",
		"catagory": "العناية الشخصية",
		"subcatagory": "معقم فم",
		"picture": "Listerine Fresh Burst Antiseptic Mouth Wash",
		"englishCat": "personal care"
	},
	{
		"name": "ليسترين غسول الفم خالي من الكحول بالنعناع الخفيف",
		"description": "500 ml",
		"price": "5.20",
		"catagory": "العناية الشخصية",
		"subcatagory": "معقم فم",
		"picture": "Listerine Cool Mint Mouth Wash",
		"englishCat": "personal care"
	},
	{
		"name": "كولجيت بلاكس حماية متعددة غسول للفم",
		"description": "500 ml",
		"price": "4.80",
		"catagory": "العناية الشخصية",
		"subcatagory": "معقم فم",
		"picture": "Colgate Plax Multi Protection Mouthwash",
		"englishCat": "personal care"
	},
	{
		"name": "هاربيك بور بلس سائل منظف للتواليت",
		"description": "750 ml",
		"price": "1.70",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منظفات الحمام",
		"picture": "Harpic Power Plus Max Liquid Toilet Cleaner",
		"englishCat": "household"
	},
	{
		"name": "فلاش الأصلي مزيل التكلس للمراحيض",
		"description": "1 L",
		"price": "1.10",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منظف الصحون",
		"picture": "Flash Original Bowl Descalent",
		"englishCat": "household"
	},
	{
		"name": "لافو منظف المرحاض برائحة الخوخ",
		"description": "500 ml",
		"price": "0.78",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منظف الصحون",
		"picture": "Lavo Peach Scented Toilet Cleaner",
		"englishCat": "household"
	},
	{
		"name": "اجاكس اوبتمل 7 منظف حمام لإزالة التبقعات بخاخ",
		"description": "600 ml",
		"price": "1.99",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منظف الصحون",
		"picture": "Ajax Optimal 7 Spray Bathroom Descaling Cleaner",
		"englishCat": "household"
	},
	{
		"name": "مستر مصل سائل كثيف عميق المفعول رائحة اللافندر",
		"description": "825 ml",
		"price": "2.79",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منظف الصحون",
		"picture": "Mr Muscle Deep Action Thick Liquid",
		"englishCat": "household"
	},
	{
		"name": "فيري الأصلي كبسولات لغسالة الصحون",
		"description": "48 ct",
		"price": "12.30",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منظف الصحون",
		"picture": "Fairy Original All In One Lemon Dishwasher Tablets",
		"englishCat": "household"
	},
	{
		"name": "بونو سائل غسيل الصحون برائحة الفراولة",
		"description": "2 L",
		"price": "1.69",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منظف الصحون",
		"picture": "Bono Strawberry Scented Dishwashing Liquid",
		"englishCat": "household"
	},
	{
		"name": "بونو سائل غسيل الصحون برائحة البرتقال",
		"description": "2 L",
		"price": "1.69",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منظف الصحون",
		"picture": "Bono Orange Scented Dishwashing Liquid",
		"englishCat": "household"
	},
	{
		"name": "بونو سائل غسيل الصحون برائحة الفراولة",
		"description": "1 L",
		"price": "0.83",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منظف الصحون",
		"picture": "Bono Red Strawberry Scented Dishwashing Liquid",
		"englishCat": "household"
	},
	{
		"name": "جولدن سائل غسيل الصحون برائحة زهور الربيع",
		"description": "3.85 kg",
		"price": "3.67",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منظف الصحون",
		"picture": "Golden Spring Flowers Scented Dishwashing Liquid",
		"englishCat": "household"
	},
	{
		"name": "فيرى سائل جلى برائحة الليمون",
		"description": "900 ml",
		"price": "1.97",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منظف الصحون",
		"picture": "Fairy Lemon Scented Dishwashing Liquid",
		"englishCat": "household"
	},
	{
		"name": "برسيل 3ب1 كبسولات غسل الملابس الحيوية",
		"description": "1026 g",
		"price": "13.15",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "مسحوق غسيل",
		"picture": "Persil 3In1 Bio Washing Capsules",
		"englishCat": "household"
	},
	{
		"name": "تايد مسحوق غسيل مركز بالرائحة الاصلية",
		"description": "5 kg",
		"price": "8.95",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "مسحوق غسيل",
		"picture": "Tide Automatic Original Scented Concentrated Laundry Detergent",
		"englishCat": "household"
	},
	{
		"name": "العملاق ايكو كلين مسحوق الغسيل رغوة منخفضة",
		"description": "3 Kg",
		"price": "3.70",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "مسحوق غسيل",
		"picture": "Al Emlaq Eco Clean Low Foam Washing Powder",
		"englishCat": "household"
	},
	{
		"name": "العملاق مسحوق المنظفات ايكو كلين رغوة منخفضة منخفضة الرغوة",
		"description": "5 kg",
		"price": "5.60",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "مسحوق غسيل",
		"picture": "Al Emlaq Eco Clean Low Foaming Powder Laundry Detergent Green Bag",
		"englishCat": "household"
	},
	{
		"name": "العملاق مسحوق المنظفات ايكو كلين رغوة منخفضة منخفضة الرغوة",
		"description": "1.5 kg",
		"price": "",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "مسحوق غسيل",
		"picture": "Al Emlaq Detergent Powder Eco Clean Low Foam",
		"englishCat": "household"
	},
	{
		"name": "ايريال جل لغسيل الملابس للغسالات الاوتوماتيكية",
		"description": "3 L",
		"price": "7.48",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "مسحوق غسيل",
		"picture": "Ariel Automatic Power Gel Laundry Detergent",
		"englishCat": "household"
	},
	{
		"name": "فاين ورق تواليت كومفورت",
		"description": "32 ct",
		"price": "5.75",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منتجات ورقية",
		"picture": "Fine Comfort Toilet Rolls",
		"englishCat": "household"
	},
	{
		"name": "سوفت مناديل ناعمة",
		"description": "250x10 ct",
		"price": "4.85",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منتجات ورقية",
		"picture": "Soft Premium Tissues",
		"englishCat": "household"
	},
	{
		"name": "فاين كلاسيك مناديل ناعمة ومعقمة",
		"description": "8 x 200 ct",
		"price": "JD 5.99 ",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منتجات ورقية",
		"picture": "Fine Classic Sterilised Soft Tissues",
		"englishCat": "household"
	},
	{
		"name": "نمبر 1 مناديل ورقية للوجه",
		"description": "10x200 ct",
		"price": "3.49",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منتجات ورقية",
		"picture": "No.1 Facial Tissues",
		"englishCat": "household"
	},
	{
		"name": "فاين ورق تنشيف رول",
		"description": "1000 ct",
		"price": "2.15",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منتجات ورقية",
		"picture": "Fine Tissues",
		"englishCat": "household"
	},
	{
		"name": "سانيتا جبسي رول ماكسي للتنشيف",
		"description": "1500 ct",
		"price": "2.50",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منتجات ورقية",
		"picture": "Sanita Gipsy Maxi Tissue Roll",
		"englishCat": "household"
	},
	{
		"name": "نابيز مناديل ورقية للوجه",
		"description": "200 ct",
		"price": "0.25",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منتجات ورقية",
		"picture": "Nappies Facial Tissue",
		"englishCat": "household"
	},
	{
		"name": "نابيز مناديل رول للحمام",
		"description": "10 ct",
		"price": "0.92",
		"catagory": "مستلزمات المنزل و التنظيف",
		"subcatagory": "منتجات ورقية",
		"picture": "Nappies Toilet Tissue Roll",
		"englishCat": "household"
	}

];

constructor(private alertCtrl: AlertController, private firebasee:AngularFireAuth, private httpClinet: HttpClient, private menuService: MenuServiceService) { }

  ngOnInit() {
    this.form = new FormGroup({
      location: new FormControl(null, { validators: [Validators.required] })
    });


    // this.form = new FormGroup({
    //   location: new FormControl(null, { validators: [Validators.required] })
    // });


    // firebase.initializeApp(environment.firebaseConfig);
  //  this.httpClinet.put('https://twiick-default-rtdb.firebaseio.com/products/k/arabic.json', this.products).subscribe(data =>
  //   {
  //   console.log(data);
  //   });


//  this.appVerifier = new firebase.auth.RecaptchaVerifier( "recaptcha-container", {
//   size: "invisible",
//   'callback': (response) => {
//     // reCAPTCHA solved, allow signInWithPhoneNumber.
//     console.log("call");
//    //this.signInWithNumber();
//   }
// });

// this.firebasee.signInWithPhoneNumber('+962799702071',this.appVerifier).then(async (confirmationResult) => {
//   // SMS sent. Prompt user to type the code from the message, then sign the
//   // user in with confirmationResult.confirm(code).
//   console.log("done");


//   let prompt = await this.alertCtrl.create({
//     header: 'Enter',
//     inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
//     buttons: [
//       { text: 'Cancel',
//         handler: data => { console.log('Cancel clicked'); }
//       },
//       { text: 'Send',
//         handler: data => {
//           confirmationResult.confirm(data.confirmationCode)
//           .then(function (result) {
//             // User signed in successfully.
//             console.log(result.user);
//             // ...
//           }).catch(function (error) {
//             console.log(error);
//             // ...
//           });
//         }
//       }
//     ]
//   });
//    await prompt.present();


// }).catch((error) => {
//   console.log("error");
//   // Error; SMS not sent
//   // ...
// });






  }



  menuClicked(){
    this.menuService.menuClicked();
  }

  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({ location: location });
  }



}
