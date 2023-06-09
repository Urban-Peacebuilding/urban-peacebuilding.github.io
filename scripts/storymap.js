$(window).on('load', function() {
  var documentSettings = {};

  // Some constants, such as default settings
  const CHAPTER_ZOOM = 15;

  // First, try reading Options.csv
  $.get('csv/Options.csv', function(options) {

    $.get('csv/Chapters.csv', function(chapters) {
      initMap(
        $.csv.toObjects(options),
        $.csv.toObjects(chapters)
      )
    }).fail(function(e) { alert('Found Options.csv, but could not read Chapters.csv') });

  // If not available, try from the Google Sheet
  }).fail(function(e) {

    var parse = function(res) {
      return Papa.parse(Papa.unparse(res[0].values), {header: true} ).data;
    }

    // First, try reading data from the Google Sheet
    if (typeof googleDocURL !== 'undefined' && googleDocURL) {

      if (typeof googleApiKey !== 'undefined' && googleApiKey) {

        var apiUrl = 'https://sheets.googleapis.com/v4/spreadsheets/'
        var spreadsheetId = googleDocURL.split('/d/')[1].split('/')[0];

        $.when(
          $.getJSON(apiUrl + spreadsheetId + '/values/Options?key=' + googleApiKey),
          $.getJSON(apiUrl + spreadsheetId + '/values/Chapters?key=' + googleApiKey),
        ).then(function(options, chapters) {
          initMap(parse(options), parse(chapters))
        })

      } else {
        alert('You load data from a Google Sheet, you need to add a free Google API key')
      }

    } else {
      alert('You need to specify a valid Google Sheet (googleDocURL)')
    }

  })



  /**
  * Reformulates documentSettings as a dictionary, e.g.
  * {"webpageTitle": "Leaflet Boilerplate", "infoPopupText": "Stuff"}
  */
  function createDocumentSettings(settings) {
    for (var i in settings) {
      var setting = settings[i];
      documentSettings[setting.Setting] = setting.Customize;
    }
  }

  /**
   * Returns the value of a setting s
   * getSetting(s) is equivalent to documentSettings[constants.s]
   */
  function getSetting(s) {
    return documentSettings[constants[s]];
  }

  /**
   * Returns the value of setting named s from constants.js
   * or def if setting is either not set or does not exist
   * Both arguments are strings
   * e.g. trySetting('_authorName', 'No Author')
   */
  function trySetting(s, def) {
    s = getSetting(s);
    if (!s || s.trim() === '') { return def; }
    return s;
  }

  /**
   * Loads the basemap and adds it to the map
   */
  function addBaseMap() {
    var basemap = trySetting('_tileProvider', 'Stamen.TonerLite');
    L.tileLayer.provider(basemap, {
      maxZoom: 18
    }).addTo(map);
  }

  function initMap(options, chapters) {
    createDocumentSettings(options);

    var chapterContainerMargin = 70;

    document.title = getSetting('_mapTitle');
    $('#header').append('<h1>' + (getSetting('_mapTitle') || '') + '</h1>');
    $('#header').append('<h2>' + (getSetting('_mapSubtitle') || '') + '</h2>');

    // Add logo
    if (getSetting('_mapLogo')) {
      $('#logo').append('<img src="' + getSetting('_mapLogo') + '" />');
      $('#top').css('height', '60px');
    } else {
      $('#logo').css('display', 'none');
      $('#header').css('padding-top', '25px');
    }

    // Load tiles
    addBaseMap();
  
    var info = document.getElementById('info');

    //Bato Mosque
    var batomosque = '<div class="tabs">' +

            '<div class="tab" id="tab-1">' +
            '<div class="content">' +
            '<div class="tabtitle">' +
            '<h3> Before the Siege </h3>' +
            '<b><img src="media/bato-mosque-before.png"/></b>' +            
            '<div class="caption">' +
            '<h2>The Dansalan Bato Ali Mosque or Bato Mosque is one of the prominent mosques in Marawi City. It was constructed in the 1950s and named after former Marawi City Mayor Sultan Bato Ali. Also called the Maahad or Jameo Dansalan Al-Islamie, the mosque is not just a place of worship but also of Islamic education, housing several classrooms in its basement. It played a central role in the Islamization of Marawi.</h2>' +
            '<br></br>' +
            '<h4> Photo Credits: <a href="http://nashiibamastura.weebly.com/masjid.htm"><h4> Matataid </h4></a></h4>' +                
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="tab" id="tab-2">' +
            '<div class="content">' +
            '<div class="tabtitle">' +
            '<h3> During the Siege </h3>' +
            '<b><img src="media/bato-mosque-during.jpg"/></b>' +            
            '<div class="caption">' +
            '<h2>The Bato Mosque was the largest logistics hub of the Maute/ASG militants. The military was able to seize the mosque from the militants after a 12-day intense shootout. The military initially assured the public that religious and cultural sites will not be targeted, which contributed to the prolonged battle as the militants turned these holy sites into hideouts. Ultimately, the aerial bombardment to flush out the militants from the city caused heavy damage to the mosques, including the Bato Mosque.</h2>' +
            '<br> </br>' +
            '<h4>Photo Credits: Dahlia Simangan, March 2019</h4>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
    
            '<div class="tab" id="tab-3">' +
            '<div class="content">' +
            '<div class="tabtitle">' +
            '<h3>After the Siege</h3>' +
            '<b><img src="media/bato-mosque-after.jpg"/></b>' +            
            '<div class="caption">' +
            '<h2>In the aftermath of the Marawi Siege, the Bato Mosque was marked for demolition. The reconstruction started on 16 July 2020 and was completed in September 2022. According to the reconstruction plan, the principal architect consulted with Muslim architect associates, as required by the mosque’s administrator, while the MAMSAR Construction and Industrial Cooperation, mostly staffed by Mranaws, led the reconstruction. The new Bato Mosque features a more “modern” architectural style. The old, bullet-holed minaret has been preserved and displayed at the entrance of the newly built Marawi Museum in the Peace Memorial Park located in the rehabilitated Padian or Grand Market.</h2>' +
            '<br> </br>' +
            '<h4>Photo Credits: Dahlia Simangan, December 2022</h4>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +

            '<div class="tab" id="tab-4">' +
            '<div class="content">' +
            '<div class="tabtitle">' +
            '<h3>Interview</h3>' +      
            '<iframe width="560" height="315" src="https://www.youtube.com/embed/2NFQlXNir_o" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+            
            '<h2>Bato Mosque, Marawi City, Philippines - December 2022</h2>' +      
            '</div>' +
            '</div>' +
            '</div>' +
    
            '<div class="tab" id="tab-5">' +
            '<div class="content">' +
            '<div class="tabtitle">' +
            '<h3>Aerial View</3>' +         
            '<iframe width="560" height="315" src="https://www.youtube.com/embed/YrMhC6nK-mM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+            
            '<h2>Bato Mosque, Marawi City, Philippines - December 2022</h2>' +      
            '</div>' +
            '</div>' +
            '</div>' +
    
            '<ul class="tabs-link">' +
            '<li class="tab-link"> <a href="#tab-1"><span>Before the Siege</span></a></li>' +
            '<li class="tab-link"> <a href="#tab-2"><span>During the Siege</span></a></li>' +
            '<li class="tab-link"> <a href="#tab-3"><span>After the Siege</span></a></li>' +
            '<li class="tab-link"> <a href="#tab-4"><span>Interview</span></a></li>' +
            '<li class="tab-link"> <a href="#tab-5"><span>Aerial View</span></a></li>' +
            '</ul>' +
      '</div>';

      //Grand Mosque
      var grandmosque = '<div class="tabs">' +

        '<div class="tab" id="tab-1">' +
        '<div class="content">' +
        '<div class="tabtitle">' +
        '<h3> Before the Siege </h3>' +
        '<b><img src="media/grand-mosque-before.jpg"/></b>' +        
        '<div class="caption">' +
        '<h2>The Grand Mosque or Marawi City, also known as the Jameo Mindanao Al-Islamie Islamic Center, is the largest mosque not only in Marawi City but in the entire Philippines. Located along Disalongan Pangarungan Street at the heart of the Most Affected Area (MAA), its construction started in 1950 and was completed in 1970 through the support of Marawi residents, private individuals, and foreign donors. The Grand Mosque is historically and culturally significant to Mranaws. Aside from being a place of worship, the mosque also serves as an Islamic school and a place for daily Mushawara or meetings when Mranaws discuss religious, social, and political issues. In 1969, a year after the Jabidah Massacre, Mranawas and other Bangsamoro tribes held a mass protest in front of the mosque, leading to the formation of Ansar Al-Islam, a movement in defence of Islamic religion and aimed at re-establishing Islamic ideology in the Philippines. In 1972, Mranaws and other Bangsamoro tribes held a mass protest in front of the Grand Mosque, leading to the formation of Ansar Al-Islamie Movement, which is a response to the declaration of Martial Law.</h3>' +
        '<br> </br>' +
        '<h4> Photo Credits: <a href="https://habagatcentral.com/"><h4> HabagatCentral </h4></a></h4>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div class="tab" id="tab-2">' +
        '<div class="content">' +
        '<div class="tabtitle">' +
        '<h3> During the Siege </h3>' +
        '<b><img src="media/grand-mosque-during.jpg"/></b>' +        
        '<div class="caption">' +
        '<h2>The Grand Mosque became one of the first hideouts of the Maute/ASG militants during the Marawi Siege. The mosque’s two minarets, providing a bird’s eye view of the three bridges connecting the city, became the militants’ sniper nest, preventing the military to penetrate through ground operations. The military initially assured the public that religious and cultural sites will not be targeted, which contributed to the prolonged battle as the militants turned these holy sites into hideouts. Even though the military did not use air bombardments and mortar rounds on the mosque, its upper structure still sustained heavy damage.</h2>' +
        '<br> </br>' +
        '<h4>Photo Credits: Dahlia Simangan, March 2019</h4>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div class="tab" id="tab-3">' +
        '<div class="content">' +
        '<div class="tabtitle">' +
        '<h3>After the Siege</h3>' +
        '<b><img src="media/grand-mosque-after.jpg"/></b>' +        
        '<div class="caption">' +
        '<h2>The Grand Mosque was heavily damaged during the aerial bombardment and was marked for repair and reconstruction. The repair works were completed in October 2021, when President Rodrigo Roa Duterte led the unveiling of the rehabilitated mosque, which was officially handed over to its administrators in December 2021. The old mosque’s green accents have been replaced with gold, but the Makkah-inspired open ceiling of the central lobby, which was used for Friday congregational prayers before the siege, remains.</h2>' +
        '<br> </br>' +
        '<h4>Photo Credits: Dahlia Simangan, December 2022</h4>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div class="tab" id="tab-4">' +
        '<div class="content">' +
        '<div class="tabtitle">' +
        '<h3>Interview</h3>' +  
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/0IcqOPdetRw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+            
        '<h2>Grand Mosque, Marawi City, Philippines - December 2022</h2>' +          
        '</div>' +
        '</div>' +
        '</div>' +

        '<div class="tab" id="tab-5">' +
        '<div class="content">' +
        '<div class="tabtitle">' +
        '<h3>Aerial View</h3>' +
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/330N4aragio" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+           
        '<h2>Grand Mosque, Marawi City, Philippines - December 2022</h2>' +             
        '</div>' +
        '</div>' +
        '</div>' +

        '<ul class="tabs-link">' +
        '<li class="tab-link"> <a href="#tab-1"><span>Before the Siege</span></a></li>' +
        '<li class="tab-link"> <a href="#tab-2"><span>During the Siege</span></a></li>' +
        '<li class="tab-link"> <a href="#tab-3"><span>After the Siege</span></a></li>' +
        '<li class="tab-link"> <a href="#tab-4"><span>Interview</span></a></li>' +
        '<li class="tab-link"> <a href="#tab-5"><span>Aerial View</span></a></li>' +
        '</ul>' +
      '</div>';  

      //Padian
      var padian = '<div class="tabs">' +

          '<div class="tab" id="tab-1">' +
          '<div class="content">' +
          '<div class="tabtitle">' +
          '<h3> Before the Siege </h3>' +
          '<b><img src="media/padian-before.jpg"/></b>' +          
          '<div class="caption">' +
          '<h2>Padian or the Grand Market is the commercial center of the entire province of Lanao del Sur. It is located in Dansalan (the old name of Marawi City) where various goods, including traditional textiles and Mranaw delicacies and antiques, are sold. Known as the trading hub for Islamic provinces in Mindanao, Padian was also previously called Dansalan, which comes from the word dansal or arrival. As the locals say, “di ka ma Mranaw o da ka makadapo sa Padian” (“You are not a Mranaw if you have not set foot at Padian”), symbolizing the economic and cultural significance of Padian.</h2>' +
          '<br> </br>' +
          '<h4> Photo Credits: <a href="https://www.mindanews.com/photo-of-the-day/2019/05/marawi-before-and-after-the-siege/"><h4> Bobby Timonera, May 2019 </h4></a></h4>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>' +

          '<div class="tab" id="tab-2">' +
          '<div class="content">' +
          '<div class="tabtitle">' +
          '<h3> During the Siege </h3>' +
          '<b><img src="media/padian-during.jpg"/></b>' +          
          '<div class="caption">' +
          '<h2>Padian served as one of the hideouts of the Maute/ASG militants during the Marawi siege. The militants were able to source their supplies, such as food, water, and medicine, from the business stalls and use the concrete underground structures of the market. These structures held the hostages and female militants who were serving as medics and cooks. Due to its proximity to the shores of Lake Lanao, the planned exit point in case of retreat, Padian was the decisive site that ended the Marawi Siege after government forces seized the militants’ final stronghold, a two-storey building next to Lake Lanao.</h2>' +
          '<br> </br>' +
          '<h4> Photo Credits: <a href="https://www.mindanews.com/photo-of-the-day/2019/05/marawi-before-and-after-the-siege/"><h4> Bobby Timonera, May 2019 </h4></a></h4>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>' +

          '<div class="tab" id="tab-3">' +
          '<div class="content">' +
          '<b><img src="media/padian-after.jpg"/></b>' +
          '<div class="tabtitle">' +
          '<h3>After the Siege</h3>' +
          '<div class="caption">' +
          '<h2>The reconstruction of Padian started on December 23, 2019. The old Padian site is now transformed into a Peace Memorial Park, including a museum and a school of living traditions. Adjacent to the park is a new sports complex that can seat 3,700 spectators and a convention center for indoor events. Included in the plan is the construction of a new Grand Padian Central Market, a three-storey shopping mall. These new structures, which costed around PhP10 billion to build, remain empty as of December 2022 as most residents of the Most Affected Area (MAA) are yet to return.</h2>' +
          '<br> </br>' +
          '<h4>Photo Credits: Dahlia Simangan, December 2022</h4>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>' +

          '<div class="tab" id="tab-4">' +
          '<div class="content">' +
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/ERb2sZ0Z-u4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+
          '<div class="tabtitle">' +
          '<h3>Interview</h3>' +     
          '<h2>Padian, Marawi City, Philippines - December 2022</h2>' +       
          '</div>' +
          '</div>' +
          '</div>' +

          '<div class="tab" id="tab-5">' +
          '<div class="content">' +
          '<h3>Aerial Views</h3>' +    
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/HCySbN_wXyo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+
          '<h2> Convention Center, Marawi City - December 2022</h2>' +
          '<br> </br>' +
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/4BTz1v59TBU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+
          '<h2> Peace Park, Marawi City - December 2022 </h2>' +
          '<br> </br>' +
          '<iframe width="560" height="315" src="https://www.youtube.com/embed/oM8ulHyhS_U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+
          '<h2>Sports Complex, Marawi City - December 2022 </h2>' + 
          '<div class="tabtitle">' +                         
          '</div>' +
          '</div>' +
          '</div>' +

          '<ul class="tabs-link">' +
          '<li class="tab-link"> <a href="#tab-1"><span>Before the Siege</span></a></li>' +
          '<li class="tab-link"> <a href="#tab-2"><span>During the Siege</span></a></li>' +
          '<li class="tab-link"> <a href="#tab-3"><span>After the Siege</span></a></li>' +
          '<li class="tab-link"> <a href="#tab-4"><span>Interview</span></a></li>' +
          '<li class="tab-link"> <a href="#tab-5"><span>Aerial Views</span></a></li>' +
          '</ul>' +
      '</div>';  

      //Saint Mary's Cathedral
      var cathedral = '<div class="tabs">' +

        '<div class="tab" id="tab-1">' +
        '<div class="content">' +
        '<div class="tabtitle">' +
        '<h3> Before the Siege </h3>' +
        '<b><img src="media/st-marys-cathedral-before.jpg"/></b>' +        
        '<div class="caption">' +
        '<h2>The Prelature of Santa Maria Auxiliadora Cathedral in Marawi City started as a parish founded by Jesuits in 1933. After the division of Lanao province into Lanao del Norte and Lanao del Sur and due to the hostile situation between Christians and Muslims, then Bishop Bienvenido Tudtud’s proposal to Rome for a separate prelature for Marawi City was approved in December 1976. And in 2001, the prelature took the name of Prelature of St. Mary’s after the city’s patron saint, Maria Auxiliadora. As a local church, it aims to facilitate dialogue between Christian and Muslim followers.</h2>' +
        '<br> </br>' +
        '<h4> Photo Credits: <a href="https://www.facebook.com/groups/Santa.Maria.Auxilladora/"><h4> St. Mary&#39s Cathedral Parish - Marawi City, Facebook page, October 2015 </h4></a></h4>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div class="tab" id="tab-2">' +
        '<div class="content">' +
        '<b><img src="media/st-marys-cathedral-during.jpg"/></b>' +
        '<div class="tabtitle">' +
        '<h3> During the Siege </h3>' +
        '<div class="caption">' +
        '<h2>St. Mary’s Cathedral was one of the first sites inside the Most Affected Area (MAA) in Marawi City that had been attacked by the Maute/ASG militants, along with the burning of Dansalan College, which is known for having Christian teachers. It was in St. Mary’s Cathedral where Fr. Teresito ‘Chito’ Soganub was abducted and later held hostage. The militants attacked the Seat of the Prelature of Marawi and destroyed the cathedral, desecrating sacred images, including its patroness, and shared through their propaganda videos.</h2>' +
        '<br> </br>' +
        '<h4> Photo Credits: <a href="https://www.heraldmalaysia.com/news/marawi-first-mass-in-st-marys-cathedral-since-end-of-siege/38604/1"><h4> Herald Malaysia, October 2017 </h4></a></h4>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div class="tab" id="tab-3">' +
        '<div class="content">' +
        '<b><img src="media/st-marys-cathedral-after.jpg"/></b>' +
        '<div class="tabtitle">' +
        '<h3>After the Siege</h3>' +
        '<div class="caption">' +
        '<h2>The reconstruction of St. Mary’s Cathedral would have to wait until all the damaged mosques in the city are rebuilt or repaired. This was the proclamation of Brother Reynaldo Barnido, the executive director of Duyog Marawi (One with Marawi), a non-governmental organization set up by the Catholic prelature for the rehabilitation of Marawi City. Bishop Edwin Angot de la Peña, the prelate of the prelature of Marawi, is also prioritizing social reconciliation rather than the physical reconstruction of the cathedral. According to Bishop de la Peña, after the rehabilitation of all the damaged mosques, the cathedral will be demolished to give way to a smaller church, symbolizing reconciliation.</b>' +
        '<br> </h2>' +
        '<br> </br>' +
        '<h4>Photo Credits: Raihan A. Yusoph, September 2021</h4>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div class="tab" id="tab-4">' +
        '<div class="content">' +
        '<div class="tabtitle">' +
        '<h3>Interview</h3>' +  
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/CtMgIzxOtSY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+
        '<h2>St. Mary&#39s Cathedral, Marawi City, Philippines - December 2022</h2>' +                   
        '</div>' +
        '</div>' +
        '</div>' +

        '<div class="tab" id="tab-5">' +
        '<div class="content">' +
        '<div class="tabtitle">' +
        '<h3>Aerial View</h3>' +
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/5-IWQtwXQdo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+        
        '<h2>St. Mary&#39s Cathedral, Marawi City, Philippines - December 2022</h2>' +                
        '</div>' +
        '</div>' +
        '</div>' +

        '<ul class="tabs-link">' +
        '<li class="tab-link"> <a href="#tab-1"><span>Before the Siege</span></a></li>' +
        '<li class="tab-link"> <a href="#tab-2"><span>During the Siege</span></a></li>' +
        '<li class="tab-link"> <a href="#tab-3"><span>After the Siege</span></a></li>' +
        '<li class="tab-link"> <a href="#tab-4"><span>Interview</span></a></li>' +
        '<li class="tab-link"> <a href="#tab-5"><span>Aerial View</span></a></li>' +
        '</ul>' +
      '</div>';  
   
      //Bridges
      var banggolo = '<div class="tabs">' +

        '<div class="tab" id="tab-1">' +        
        '<div class="content">' +
        '<div class="tabtitle">' +
        '<h3> Before the Siege </h3>' +
        '<div class="caption">' +
        '<h2>Three bridges cross Marawi’s Agus River. First is the Banggolo (Agus-1) bridge, which is the main entrance to the center of Marawi City, serving public vehicles going to Gomeza Avenue and Perez Street in Padian (Grand Market). Second is the Mapandi (Agus-2) bridge, located between Barangay Mapandi and Barangay Daguduban and used to be the exit point for public vehicles. Third is the Raya Madaya bridge, connecting Barangay Pumping and Barangay Raya Madaya, built to ease traffic congestion at Banggolo bridge. Traditionally, Mranaws used lansa or a small boat to transport their goods to Padian. The construction of the bridges assisted the transportation and commercial needs of the city. Former Mayor Omar Ali Solitario renamed the Banggolo, Mapandi, and Raya Madaya bridges in 2007 into Bayabao, Baloi, and Masiu, respectively, in honor of the old principalities of Lanao.</h2>' +        
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div class="tab" id="tab-2">' +
        '<div class="content">' +
        '<div class="tabtitle">' +
        '<h3> During the Siege </h3>' +
        '<b><img src="media/banggolo-bridge-during.jpeg"/></b>' +        
        '<div class="caption">' +
        '<h2>The Maute/ASG militants took control of the Banggolo, Mapandi, and Raya Madaya bridges during the Marawi Siege. The elevated location of the barangays near the bridges and the sniper nests that the militants installed in tall buildings, including the Grand Mosque, gave the militants a tactical advantage, hence the delay in the military’s takeover of the city. It was crucial for the military to reclaim the bridges in order to provide logistical support to its troops inside the Most Affected Area (MAA) and protect trapped civilians who were attempting to escape by crossing the bridges. After several offensives that resulted in military casualties, the military successfully took control of the three bridges in September 2017, changing the course of the battle against the militants.</h2>' +
        '<br> </br>' +
        '<h4> Photo Credits: <a href="https://www.cnnphilippines.com/news/2017/09/01/Marawi-Maute-Banggolo-Bridge.html"><h4> Rex Remitio for CNN Philippines, September 2017 </h4></a></h4>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div class="tab" id="tab-3">' +
        '<div class="content">' +
        '<div class="tabtitle">' +
        '<h3> After the Siege </h3>' +
        '<b><img src="media/banggolo-bridge-after.jpg"/></b>' +        
        '<div class="caption">' +
        '<h2>The Marawi Siege partially destroyed the three bridges, and their repair was prioritized to enable access to the Most Affected Area (MAA). The rehabilitation of the three bridges, including the widening of Banggolo bridge, was completed in 2022.</h2>' +
        '<br> </br>' +
        '<h4>Photo Credits: Dahlia Simangan, December 2022</h4>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div class="tab" id="tab-4">' +
        '<div class="content">' +
        '<div class="tabtitle">' +
        '<h3>Interview</h3>' + 
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/-QseXuo-Mo0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+     
        '<h2>Banggolo (Bayaobao), Mapandi (Baloi) and Raya Madaya (Masiu) Bridge, Marawi City, Philippines - December 2022</h2>' +               
        '</div>' +
        '</div>' +
        '</div>' +

        '<div class="tab" id="tab-5">' +
        '<div class="content">' +
        '<div class="tabtitle">' +
        '<h3>Aerial View</h3>' +  
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/nqbHWti0ZP0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+                  
        '<h2>Banggolo (Bayabao) Bridge, Marawi City, Philippines - December 2022</h2>' +   
        '</div>' +
        '</div>' +
        '</div>' +

        '<ul class="tabs-link">' +
        '<li class="tab-link"> <a href="#tab-1"><span>Before the Siege</span></a></li>' +
        '<li class="tab-link"> <a href="#tab-2"><span>During the Siege</span></a></li>' +
        '<li class="tab-link"> <a href="#tab-3"><span>After the Siege</span></a></li>' +
        '<li class="tab-link"> <a href="#tab-4"><span>Interview</span></a></li>' +
        '<li class="tab-link"> <a href="#tab-5"><span>Aerial View</span></a></li>' +
        '</ul>' +
      '</div>';  

      var mapandi = '<div class="tabs">' +

      '<div class="tab" id="tab-1">' +
      '<div class="content">' +        
      '<div class="tabtitle">' +
      '<h3> Before the Siege </h3>' +
      '<div class="caption">' +
      '<h2>Three bridges cross Marawi’s Agus River. First is the Banggolo (Agus-1) bridge, which is the main entrance to the center of Marawi City, serving public vehicles going to Gomeza Avenue and Perez Street in Padian (Grand Market). Second is the Mapandi (Agus-2) bridge, located between Barangay Mapandi and Barangay Daguduban and used to be the exit point for public vehicles. Third is the Raya Madaya bridge, connecting Barangay Pumping and Barangay Raya Madaya, built to ease traffic congestion at Banggolo bridge. Traditionally, Mranaws used lansa or a small boat to transport their goods to Padian. The construction of the bridges assisted the transportation and commercial needs of the city. Former Mayor Omar Ali Solitario renamed the Banggolo, Mapandi, and Raya Madaya bridges in 2007 into Bayabao, Baloi, and Masiu, respectively, in honor of the old principalities of Lanao.</h2>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +

      '<div class="tab" id="tab-2">' +
      '<div class="content">' +
      '<div class="tabtitle">' +
      '<h3> During the Siege </h3>' +
      '<b><img src="media/mapandi-bridge-during.jpeg"/></b>' +      
      '<div class="caption">' +
      '<h2>The Maute/ASG militants took control of the Banggolo, Mapandi, and Raya Madaya bridges during the Marawi Siege. The elevated location of the barangays near the bridges and the sniper nests that the militants installed in tall buildings, including the Grand Mosque, gave the militants a tactical advantage, hence the delay in the military’s takeover of the city. It was crucial for the military to reclaim the bridges in order to provide logistical support to its troops inside the Most Affected Area (MAA) and protect trapped civilians who were attempting to escape by crossing the bridges. After several offensives that resulted in military casualties, the military successfully took control of the three bridges in September 2017, changing the course of the battle against the militants.</h2>' +
      '<br> </br>' +
      '<h4> Photo Credits: <a href="https://www.mindanews.com/top-stories/2017/10/its-over-marawi-siege-ends-exactly-five-months-later/"><h4> Froilan Gallardo for MindaNews, October 2017 </h4></a></h4>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +

      '<div class="tab" id="tab-3">' +
      '<div class="content">' +
      '<b><img src="media/mapandi-bridge-after.jpg"/></b>' +
      '<div class="tabtitle">' +
      '<h3> After the Siege </h3>' +
      '<div class="caption">' +
      '<h2>The Marawi Siege partially destroyed the three bridges, and their repair was prioritized to enable access to the Most Affected Area (MAA). The rehabilitation of the three bridges, including the widening of Banggolo bridge, was completed in 2022.</h2>' +
      '<br> </br>' +
      '<h4>Photo Credits: Dahlia Simangan, December 2022</h4>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +

      '<div class="tab" id="tab-4">' +
      '<div class="content">' +
      '<div class="tabtitle">' +
      '<h3>Interview</h3>' +  
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/-QseXuo-Mo0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+  
      '<h2>Banggolo (Bayaobao), Mapandi (Baloi) and Raya Madaya (Masiu) Bridge, Marawi City, Philippines - December 2022</h2>' +              
      '</div>' +
      '</div>' +
      '</div>' +

      '<div class="tab" id="tab-5">' +
      '<div class="content">' +
      '<div class="tabtitle">' +
      '<h3>Aerial View</h3>' +  
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/SlETcU4QpV8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+              
      '<h2>Mapandi (Baloi) Bridge, Marawi City, Philippines - December 2022</h2>' +    
      '</div>' +
      '</div>' +
      '</div>' +

      '<ul class="tabs-link">' +
      '<li class="tab-link"> <a href="#tab-1"><span>Before the Siege</span></a></li>' +
      '<li class="tab-link"> <a href="#tab-2"><span>During the Siege</span></a></li>' +
      '<li class="tab-link"> <a href="#tab-3"><span>After the Siege</span></a></li>' +
      '<li class="tab-link"> <a href="#tab-4"><span>Interview</span></a></li>' +
      '<li class="tab-link"> <a href="#tab-5"><span>Aerial View</span></a></li>' +
      '</ul>' +
      '</div>'; 
      
      var rayamadaya = '<div class="tabs">' +

      '<div class="tab" id="tab-1">' +      
      '<div class="content">' +              
      '<div class="tabtitle">' +
      '<h3> Before the Siege </h3>' +
      '<div class="caption">' +
      '<h2>Three bridges cross Marawi’s Agus River. First is the Banggolo (Agus-1) bridge, which is the main entrance to the center of Marawi City, serving public vehicles going to Gomeza Avenue and Perez Street in Padian (Grand Market). Second is the Mapandi (Agus-2) bridge, located between Barangay Mapandi and Barangay Daguduban and used to be the exit point for public vehicles. Third is the Raya Madaya bridge, connecting Barangay Pumping and Barangay Raya Madaya, built to ease traffic congestion at Banggolo bridge. Traditionally, Mranaws used lansa or a small boat to transport their goods to Padian. The construction of the bridges assisted the transportation and commercial needs of the city. Former Mayor Omar Ali Solitario renamed the Banggolo, Mapandi, and Raya Madaya bridges in 2007 into Bayabao, Baloi, and Masiu, respectively, in honor of the old principalities of Lanao.</h2>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +

      '<div class="tab" id="tab-2">' +
      '<div class="content">' +
      '<div class="tabtitle">' +
      '<h3> During the Siege </h3>' +
      '<b><img src="media/raya-madaya-during.jpeg"/></b>' +      
      '<div class="caption">' +
      '<h2>The Maute/ASG militants took control of the Banggolo, Mapandi, and Raya Madaya bridges during the Marawi Siege. The elevated location of the barangays near the bridges and the sniper nests that the militants installed in tall buildings, including the Grand Mosque, gave the militants a tactical advantage, hence the delay in the military’s takeover of the city. It was crucial for the military to reclaim the bridges in order to provide logistical support to its troops inside the Most Affected Area (MAA) and protect trapped civilians who were attempting to escape by crossing the bridges. After several offensives that resulted in military casualties, the military successfully took control of the three bridges in September 2017, changing the course of the battle against the militants.</h2>' +
      '<br> </br>' +
      '<h4> Photo Credits: <a href="https://news.abs-cbn.com/news/09/22/17/look-military-reclaims-masiu-bridge-in-marawi"><h4> Raphael Bosano for ABS-CBN News, September 2017 </h4></a></h4>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +

      '<div class="tab" id="tab-3">' +
      '<div class="content">' +
      '<b><img src="media/raya-madaya-after.jpg"/></b>' +
      '<div class="tabtitle">' +
      '<h3> After the Siege </h3>' +
      '<div class="caption">' +
      '<h2>The Marawi Siege partially destroyed the three bridges, and their repair was prioritized to enable access to the Most Affected Area (MAA). The rehabilitation of the three bridges, including the widening of Banggolo bridge, was completed in 2022.</h2>' +
      '<br> </br>' +
      '<h4>Photo Credits: Dahlia Simangan, December 2022</h4>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +

      '<div class="tab" id="tab-4">' +
      '<div class="content">' +
      '<div class="tabtitle">' +
      '<h3>Interview</h3>' +     
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/-QseXuo-Mo0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+       
      '<h2>Banggolo (Bayaobao), Mapandi (Baloi) and Raya Madaya (Masiu) Bridge, Marawi City, Philippines - December 2022</h2>' +        
      '</div>' +
      '</div>' +
      '</div>' +

      '<div class="tab" id="tab-5">' +
      '<div class="content">' +
      '<div class="tabtitle">' +
      '<h3>Aerial View</h3>' +
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/FXiZWO6BXxc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+
      '<h2>Raya Madaya (Masiu) Bridge, Marawi City, Philippines - December 2022</h2>' +                      
      '</div>' +
      '</div>' +
      '</div>' +

      '<ul class="tabs-link">' +
      '<li class="tab-link"> <a href="#tab-1"><span>Before the Siege</span></a></li>' +
      '<li class="tab-link"> <a href="#tab-2"><span>During the Siege</span></a></li>' +
      '<li class="tab-link"> <a href="#tab-3"><span>After the Siege</span></a></li>' +
      '<li class="tab-link"> <a href="#tab-4"><span>Interview</span></a></li>' +
      '<li class="tab-link"> <a href="#tab-5"><span>Aerial View</span></a></li>' +
      '</ul>' +
      '</div>'; 

    // Add zoom controls if needed
    if (getSetting('_zoomControls') !== 'off') {
      L.control.zoom({
        position: getSetting('_zoomControls')
      }).addTo(map);
    }

      
      
    var markers = [];

    var markActiveColor = function(k) {
      /* Removes marker-active class from all markers */
      for (var i = 0; i < markers.length; i++) {
        if (markers[i] && markers[i]._icon) {
          markers[i]._icon.className = markers[i]._icon.className.replace(' marker-active', '');

          if (i == k) {
            /* Adds marker-active class, which is orange, to marker k */
            markers[k]._icon.className += ' marker-active';
          }
        }
      }
    }

    var pixelsAbove = [];
    var chapterCount = 0;

    var currentlyInFocus; // integer to specify each chapter is currently in focus
    var overlay;  // URL of the overlay for in-focus chapter
    var geoJsonOverlay;

    for (i in chapters) {
      var c = chapters[i];

      if ( !isNaN(parseFloat(c['Latitude'])) && !isNaN(parseFloat(c['Longitude']))) {
        var lat = parseFloat(c['Latitude']);
        var lon = parseFloat(c['Longitude']);

        chapterCount += 1;

        markers.push(
          L.marker([lat, lon], {
            icon: L.ExtraMarkers.icon({
              icon: 'fa-number',
              number: c['Marker'] === 'Numbered'
                ? chapterCount
                : (c['Marker'] === 'Plain'
                  ? ''
                  : c['Marker']), 
              markerColor: c['Marker Color'] || 'blue'
            }),
            opacity: c['Marker'] === 'Hidden' ? 0 : 0.9,
            interactive: c['Marker'] === 'Hidden' ? false : true,
          }
        ));

      } else {
        markers.push(null);
      }

    


      // Add chapter container
      var container = $('<div></div>', {
        id: 'container' + i,
        class: 'chapter-container'
      });


      // Add media and credits: YouTube, audio, or image
      var media = null;
      var mediaContainer = null;

      // Add media source
      var source = '';
      if (c['Media Credit Link']) {
        source = $('<a>', {
          text: c['Media Credit'],
          href: c['Media Credit Link'],
          target: "_blank",
          class: 'source'
        });
      } else {
        source = $('<span>', {
          text: c['Media Credit'],
          class: 'source'
        });
      }

      // YouTube
      if (c['Media Link'] && c['Media Link'].indexOf('youtube.com/') > -1) {
        media = $('<iframe></iframe>', {
          src: c['Media Link'],
          width: '100%',
          height: '100%',
          frameborder: '0',
          allow: 'autoplay; encrypted-media',
          allowfullscreen: 'allowfullscreen',
        });

        mediaContainer = $('<div></div>', {
          class: 'img-container'
        }).append(media).after(source);
      }

      // If not YouTube: either audio or image
      var mediaTypes = {
        'jpg': 'img',
        'jpeg': 'img',
        'png': 'img',
        'tiff': 'img',
        'gif': 'img',
        'mp3': 'audio',
        'ogg': 'audio',
        'wav': 'audio',
      }

      var mediaExt = c['Media Link'] ? c['Media Link'].split('.').pop().toLowerCase() : '';
      var mediaType = mediaTypes[mediaExt];

      if (mediaType) {
        media = $('<' + mediaType + '>', {
          src: c['Media Link'],
          controls: mediaType === 'audio' ? 'controls' : '',
          alt: c['Chapter']
        });

        var enableLightbox = getSetting('_enableLightbox') === 'yes' ? true : false;
        if (enableLightbox && mediaType === 'img') {
          var lightboxWrapper = $('<a></a>', {
            'data-lightbox': c['Media Link'],
            'href': c['Media Link'],
            'data-title': c['Chapter'],
            'data-alt': c['Chapter'],
          });
          media = lightboxWrapper.append(media);
        }

        mediaContainer = $('<div></div', {
          class: mediaType + '-container'
        }).append(media).after(source);
      }

      container
        .append('<p class="chapter-header">' + c['Chapter'] + '</p>')
        .append(media ? mediaContainer : '')
        .append(media ? source : '')
        .append('<p class="description">' + c['Description'] + '</p>');

      $('#contents').append(container);

    }

    changeAttribution();

    /* Change image container heights */
    imgContainerHeight = parseInt(getSetting('_imgContainerHeight'));
    if (imgContainerHeight > 0) {
      $('.img-container').css({
        'height': imgContainerHeight + 'px',
        'max-height': imgContainerHeight + 'px',
      });
    }

    // For each block (chapter), calculate how many pixels above it
    pixelsAbove[0] = -100;
    for (i = 1; i < chapters.length; i++) {
      pixelsAbove[i] = pixelsAbove[i-1] + $('div#container' + (i-1)).height() + chapterContainerMargin;
    }
    pixelsAbove.push(Number.MAX_VALUE);

    $('div#contents').scroll(function() {
      var currentPosition = $(this).scrollTop();

      // Make title disappear on scroll
      if (currentPosition < 200) {
        $('#title').css('opacity', 1 - Math.min(1, currentPosition / 100));
      }

      for (var i = 0; i < pixelsAbove.length - 1; i++) {

        if ( currentPosition >= pixelsAbove[i]
          && currentPosition < (pixelsAbove[i+1] - 2 * chapterContainerMargin)
          && currentlyInFocus != i
        ) {

          // Update URL hash
          location.hash = i + 1;

          // Remove styling for the old in-focus chapter and
          // add it to the new active chapter
          $('.chapter-container').removeClass("in-focus").addClass("out-focus");
          $('div#container' + i).addClass("in-focus").removeClass("out-focus");

          currentlyInFocus = i;
          markActiveColor(currentlyInFocus);

          // Remove overlay tile layer if needed
          if (map.hasLayer(overlay)) {
            map.removeLayer(overlay);
          }

          // Remove GeoJson Overlay tile layer if needed
          if (map.hasLayer(geoJsonOverlay)) {
            map.removeLayer(geoJsonOverlay);
          }

          var c = chapters[i];

          // Add chapter's overlay tiles if specified in options
          if (c['Overlay']) {

            var opacity = parseFloat(c['Overlay Transparency']) || 1;
            var url = c['Overlay'];

            if (url.split('.').pop() === 'geojson') {
              $.getJSON(url, function(geojson) {
                overlay = L.geoJson(geojson, {
                  style: function(feature) {
                    return {
                      fillColor: feature.properties.fillColor || '#ffffff',
                      weight: feature.properties.weight || 1,
                      opacity: feature.properties.opacity || opacity,
                      color: feature.properties.color || '#cccccc',
                      fillOpacity: feature.properties.fillOpacity || 0.5,
                    }
                  }
                }).addTo(map);
              });
            } else {
              overlay = L.tileLayer(c['Overlay'], { opacity: opacity }).addTo(map);
            }

          }

          if (c['GeoJSON Overlay']) {
            $.getJSON(c['GeoJSON Overlay'], function(geojson) {

              // Parse properties string into a JS object
              var props = {};

              if (c['GeoJSON Feature Properties']) {
                var propsArray = c['GeoJSON Feature Properties'].split(';');
                var props = {};
                for (var p in propsArray) {
                  if (propsArray[p].split(':').length === 2) {
                    props[ propsArray[p].split(':')[0].trim() ] = propsArray[p].split(':')[1].trim();
                  }
                }
              }

              geoJsonOverlay = L.geoJson(geojson, {
                style: function(feature) {
                  return {
                    fillColor: feature.properties.fillColor || props.fillColor || '#ffffff',
                    weight: feature.properties.weight || props.weight || 1,
                    opacity: feature.properties.opacity || props.opacity || 0.5,
                    color: feature.properties.color || props.color || '#cccccc',
                    fillOpacity: feature.properties.fillOpacity || props.fillOpacity || 0.5,
                  }
                }
              }).addTo(map);
            });
          }

          // Fly to the new marker destination if latitude and longitude exist
          if (c['Latitude'] && c['Longitude']) {
            var zoom = c['Zoom'] ? c['Zoom'] : CHAPTER_ZOOM;
            map.flyTo([c['Latitude'], c['Longitude']], zoom, {
              animate: true,
              duration: 2, // default is 2 seconds
            });
          }

          // No need to iterate through the following chapters
          break;
        }
      }
    });

    

    $('#contents').append(" \
      <div id='space-at-the-bottom'> \
        <a href='https://srcreyes.github.io/urban-peacebuilding/'>  \
          <i class='fas fa-home'></i></br> \
          <small> Home - Urban Peacebuilding </small>  \
        </a> \
      </div> \
    ");

    /* Generate a CSS sheet with cosmetic changes */
    $("<style>")
      .prop("type", "text/css")
      .html("\
      #narration, #title {\
        background-color: " + trySetting('_narrativeBackground', 'white') + "; \
        color: " + trySetting('_narrativeText', 'black') + "; \
      }\
      a, a:visited, a:hover {\
        color: " + trySetting('_narrativeLink', 'blue') + " \
      }\
      .in-focus {\
        background-color: " + trySetting('_narrativeActive', '#f0f0f0') + " \
      }")
      .appendTo("head");


    endPixels = parseInt(getSetting('_pixelsAfterFinalChapter'));
    if (endPixels > 100) {
      $('#space-at-the-bottom').css({
        'height': (endPixels / 2) + 'px',
        'padding-top': (endPixels / 2) + 'px',
      });
    }

  
    var bounds = [];
    for (i in markers) {
      if (markers[i]) {
        markers[i].addTo(map);
        markers[i]['_pixelsAbove'] = pixelsAbove[i];
        markers[i].on('click', function() {
          var pixels = parseInt($(this)[0]['_pixelsAbove']) + 5;
          $('div#contents').animate({
            scrollTop: pixels + 'px'});
        });
        bounds.push(markers[i].getLatLng());
      }
    }
    map.fitBounds(bounds);

    $('#map, #narration, #title').css('visibility', 'visible');
    $('div.loader').css('visibility', 'hidden');

    $('div#container0').addClass("in-focus");
    $('div#contents').animate({scrollTop: '1px'});


    //Add static markers
    var customIcon = L.Icon.extend({
      options: {
        iconSize:     [22, 22],
        iconAnchor:   [10, 35],
        popupAnchor:  [0, -40]
        }
    });
  
    var mosqueIcon = new customIcon({iconUrl: 'markers/mosque.png'}),
    churchIcon = new customIcon({iconUrl: 'markers/church.png'}),
    bridgeIcon = new customIcon({iconUrl: 'markers/bridge.png'}),
    storeIcon = new customIcon({iconUrl: 'markers/store.png'});
    
    L.marker([7.99857615670883, 124.292875784581],{ icon: mosqueIcon}).bindPopup(batomosque, {maxWidth: 600}).bindTooltip("Bato Mosque").addTo(map); //Bato Mosque
    L.marker([7.9972321, 124.2905965],{ icon: storeIcon}).bindPopup(padian, {maxWidth: 600}).bindTooltip("Grand Padian").addTo(map); //Padian
    L.marker([8.00080890122295, 124.293243929985],{ icon: mosqueIcon}).bindPopup(grandmosque, {maxWidth: 600}).bindTooltip("Grand Mosque").addTo(map); //Grand Mosque
    L.marker([7.996998, 124.294523],{ icon: churchIcon}).bindPopup(cathedral, {maxWidth: 600}).addTo(map);//St Mary's Cathedral

    L.marker([8.001647, 124.2893],{ icon: bridgeIcon}).bindPopup(banggolo, {maxWidth: 600}).bindTooltip("Banggolo (Bayabao) Bridge").addTo(map);//Banggolo Bridge
    L.marker([8.005059, 124.2935497],{ icon: bridgeIcon}).bindPopup(mapandi, {maxWidth: 600}).bindTooltip("Mapandi (Baloi) Bridge").addTo(map); //Mapandi Bridge
    L.marker([8.000457, 124.2888],{ icon: bridgeIcon}).bindPopup(rayamadaya, {maxWidth: 600}).bindTooltip("Raya Madaya (Masiu)").addTo(map);//Raya Madaya Bridge

    // On first load, check hash and if it contains an number, scroll down
    if (parseInt(location.hash.substr(1))) {
      var containerId = parseInt( location.hash.substr(1) ) - 1;
      $('#contents').animate({
        scrollTop: $('#container' + containerId).offset().top
      }, 2000);
    }

    // Add Google Analytics if the ID exists
    var ga = getSetting('_googleAnalytics');
    if ( ga && ga.length >= 10 ) {
      var gaScript = document.createElement('script');
      gaScript.setAttribute('src','https://www.googletagmanager.com/gtag/js?id=' + ga);
      document.head.appendChild(gaScript);

      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', ga);
    }


  }


  /**
   * Changes map attribution (author, GitHub repo, email etc.) in bottom-right
   */
  function changeAttribution() {
    var attributionHTML = $('.leaflet-control-attribution')[0].innerHTML;
    var credit = 'View <a href="'
      // Show Google Sheet URL if the variable exists and is not empty, otherwise link to Chapters.csv
      + (typeof googleDocURL !== 'undefined' && googleDocURL ? googleDocURL : './csv/Chapters.csv')
      + '" target="_blank">data</a>';

    var name = getSetting('_authorName');
    var url = getSetting('_authorURL');

    if (name && url) {
      if (url.indexOf('@') > 0) { url = 'mailto:' + url; }
      credit += ' by <a href="' + url + '">' + name + '</a> | ';
    } else if (name) {
      credit += ' by ' + name + ' | ';
    } else {
      credit += ' | ';
    }

    credit += 'View <a href="' + getSetting('_githubRepo') + '">code</a>';
    if (getSetting('_codeCredit')) credit += ' by ' + getSetting('_codeCredit');
    credit += ' with ';
    $('.leaflet-control-attribution')[0].innerHTML = credit + attributionHTML;
  }

});
