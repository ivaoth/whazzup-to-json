<?php
  $data=file_get_contents('http://api.ivao.aero/getdata/whazzup/whazzup.txt');
  $c_data=explode('!CLIENTS'.PHP_EOL, $data);
  $c_data=explode('!AIRPORTS', $c_data[1]);
  $c_data=explode(PHP_EOL, $c_data[0]);
  $data=null;
  $i_p=0;
  $i_a=0;
  $count = count($c_data);
  foreach($c_data as $dat)
  {
    if (--$count <= 0) {
      break;
    }
    $c_dat=explode(':', $dat);
    //echo $c_dat[3].'<br>';
    if(($c_dat[3]=='PILOT' || $c_dat[3]=='FOLME') && $c_dat[20] != '') {
      $aircraft_type=explode('/', $c_dat[9]);
      $res_p[$i_p]=array(
        'callsign' => $c_dat[0],
        'vid' => $c_dat[1],
        'name' => $c_dat[2],
        'connectionTime' => $c_dat[37],
        'softwareName' => $c_dat[38],
        'softwareVersion' => $c_dat[39],
        'type' => 'pilot',
        'latitiude' => floatval($c_dat[5]),
        'longtitude' => floatval($c_dat[6]),
        'altitude' => intval($c_dat[7]),
        'groundSpeed' => intval($c_dat[8]),
        'heading' => intval($c_dat[45]),
        'onGround' => $c_dat[46] === '1',
        'squawk' => $c_dat[17],
        'rating' => $c_dat[41],
        'fullAircraft' => $c_dat[9],
        'aircraft' => $aircraft_type[1],
        'cruisingSpeed' => $c_dat[10],
        'departure' => $c_dat[11],
        'cruislingLevel' => $c_dat[12],
        'destination' => $c_dat[13],
        'flightRules' => $c_dat[21],
        'departureTime' => $c_dat[22],
        'enrouteTime' => intval($c_dat[24]) * 60 + intval($c_dat[25]),
        'endurace' => intval($c_dat[26]) * 60 + intval($c_dat[27]),
        'alternate' => $c_dat[28],
        'remarks' => $c_dat[29],
        'route' => $c_dat[30],
        'alternate2' => $c_dat[42],
        'typeOfFlight' => $c_dat[43],
        'pob' => intval($c_dat[44])
      );
      $i_p++;
      $aircraft_type=null;
    }
    else if(($c_dat[3]=='PILOT' || $c_dat[3]=='FOLME') && $c_dat[20] == '') {
      $res_p[$i_p]=array(
        'callsign' => $c_dat[0],
        'vid' => $c_dat[1],
        'name' => $c_dat[2],
        'connectionTime' => $c_dat[37],
        'softwareName' => $c_dat[38],
        'softwareVersion' => $c_dat[39],
        'type' => 'pilot',
        'latitiude' => floatval($c_dat[5]),
        'longtitude' => floatval($c_dat[6]),
        'altitude' => intval($c_dat[7]),
        'groundSpeed' => intval($c_dat[8]),
        'heading' => intval($c_dat[45]),
        'onGround' => $c_dat[46] === '1',
        'squawk' => $c_dat[17],
        'rating' => $c_dat[41]
      );
      $i_p++;
    }
    else if($c_dat[3]=='ATC' && $c_dat[18]==0) {
      $res_a[$i_a]=array(
        'callsign' => $c_dat[0],
        'vid' => $c_dat[1],
        'name' => $c_dat[2],
        'connectionTime' => $c_dat[37],
        'softwareName' => $c_dat[38],
        'softwareVersion' => $c_dat[39],
        'type' => 'observer'
      );
      $i_a++;
    }
    else if($c_dat[3]=='ATC' && $c_dat[18]==1) {
      $res_a[$i_a]=array(
        'callsign' => $c_dat[0],
        'vid' => $c_dat[1],
        'name' => $c_dat[2],
        'connectionTime' => $c_dat[37],
        'softwareName' => $c_dat[38],
        'softwareVersion' => $c_dat[39],
        'type' => 'atc',
        'frequency' => $c_dat[4],
        'facilityType' => $c_dat[18],
        'rating' => $c_dat[41]
      );
      $i_a++;
    }
  }
  $json = json_encode(array('pilot'=>$res_p,'atc'=>$res_a));
  header('Content-Type: application/json');
  echo $json;
?>