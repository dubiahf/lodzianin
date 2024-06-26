const fs = require( 'fs' ),
    path = require( 'path' ),
    Twit = require( 'twit' ),
    config = require( path.join( __dirname, 'config.js' ) );

const T = new Twit(config);

function randomFromArray(images){
    return images[Math.floor(Math.random()*images.length)];
}

function tweetRandomImage(){

  var d=new Date();
  var ahour=d.getHours(), amin=d.getMinutes(), asec=d.getSeconds();

  if (ahour<=9) ahour="0"+ahour;
  if (amin<=9) amin="0"+amin;
  if (asec<=9) asec="0"+asec;

  timetext=ahour+":"+amin+":"+asec;

    fs.readdir( __dirname + '/pic_dir', function( err, files ) {
      if ( err ){
        console.log( 'error:', err );
      }
      else{
        let images = [];
        files.forEach( function( f ) {
          images.push( f );
        } );
  
        console.log( 
          timetext+' // opening an image...' 
        );
  
        const imagePath = path.join( __dirname, '/pic_dir/' + randomFromArray( images ) ),
              b64content = fs.readFileSync( imagePath, { encoding: 'base64' } );
  
        console.log( 
          timetext+' // uploading an image...' 
        );
  
        T.post( 'media/upload', { media_data: b64content }, function ( err, data, response ) {
          if ( err ){
            console.log( 'error:', err );
          }
          //tweetowanie
          else{
            console.log( 
              timetext+' // image uploaded, now tweeting it...' 
            );
  
            T.post( 'statuses/update', {
                status: (''),
                media_ids: new Array( data.media_id_string )
            },
              function( err, data, response) {
                if (err){
                  console.log( 
                    timetext+'error:', err 
                  );
                }
                else{
                  console.log( 
                    timetext+' // posted an image!' 
                  );

                  //usuwanie zdjecia z folderu
                  fs.unlink( imagePath, function( err ){
                    if ( err ){
                      console.log( 
                        timetext+' // error: unable to delete image ' + imagePath 
                      );
                    }
                    else{
                      console.log( 
                        timetext+' // image ' + imagePath + ' was deleted' 
                      );
                    }
                  });
                }
              }
            );
          }
        } );      
      }
    } );
  }

tweetRandomImage();

setInterval( function(){
  tweetRandomImage();
}, 1000 * 60 * 60 );
