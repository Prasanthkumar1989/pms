<?php
//MYSQLI sting to connect to the database
$mysqli = mysqli_connect("localhost", "project_listuser", "C}dU)T_v+0mb", "db_project_list");

 function getB64Type($dataString) {
    // $str should start with 'data:' (= 5 characters long!)
    return substr($dataString, 5, strpos($dataString, ';')-5);
}
switch($_GET["action"]){
	case "login":
	print_r($_POST);

	break;
	// Switch case for the project list controller
	case "list":
	$q = isset($_GET['q']) ? $_GET['q'] :  "";
	$page = isset($_GET['page']) ? $_GET['page'] :  "1";
	$take = isset($_GET['per_page']) ? $_GET['per_page'] :  "";
	// Get the total number of rows in the table
	$sql = "SELECT * FROM project_list  where name like '%$q%' or category like '%$q%'" ;
	$cnt = mysqli_num_rows ( $mysqli->query($sql));
	//Calculate the last page based on total number of rows and rows per page.
	$last = ceil($cnt/$take);

	//this makes sure the page number isn't below one, or more than our maximum pages
	if ($page < 1) {
	$page = 1;
	} elseif ($page > $last)  {
	$page = $last;
	}

    $lower_limit = ($page - 1) * $take;

	if(!empty($q)){
		 $qur = $mysqli->query("SELECT * FROM project_list WHERE name like '%$q%' or category like '%$q%' limit ". ($lower_limit)." ,  ". ($take). " ");
		$result =array();
		$data=array();
		while ($row = $qur->fetch_assoc()) {
		    $data[] = array('id' => $row['id'], 'name' => $row['name'], 'category' => $row['category'], 'demo_link' => $row['demo_link'], 'live_link' => $row['live_link'], 'image' =>str_replace('../','',$row['image']), 'details' => $row['details'],'ftp_details' => $row['ftp_details'],'cpanel_details' => $row['cpanel_details'],'status'=>$row['status'],'total_count'=>$cnt);

		}
		$data['items']= $data;
		$data['total_count'] = $cnt;
	}else{
		$qur = $mysqli->query("SELECT * FROM project_list limit ". ($lower_limit)." ,  ". ($take). " ");
		$result =array();
		$data=array();
		while ($row = $qur->fetch_assoc()) {
		    $data[] = array('id' => $row['id'], 'name' => $row['name'], 'category' => $row['category'], 'demo_link' => $row['demo_link'], 'live_link' => $row['live_link'], 'image' =>str_replace('../','',$row['image']), 'details' => $row['details'],'ftp_details' => $row['ftp_details'],'cpanel_details' => $row['cpanel_details'],'status'=>$row['status'],'total_count'=>$cnt);

		}
		$data['items']= $data;
		$data['total_count'] = $cnt;
		//$json = array("status" => 1, "items" => $data);
	}
	echo json_encode($data);
		$mysqli->close();


		// $query = "SELECT * FROM project_list";
		// $result = $mysqli->query($query);
		// while ($row = $result->fetch_assoc()) {
		// 	$json[] = array('id' => $row['id'], 'name' => $row['name'], 'category' => $row['category'], 'demo_link' => $row['demo_link'], 'live_link' => $row['live_link'], 'image' =>str_replace('../','',$row['image']), 'details' => $row['details'],'ftp_details' => $row['ftp_details'],'cpanel_details' => $row['cpanel_details']);
		// }
		// echo json_encode($json);
		// $mysqli->close();
	break;
	// Switch case for the Project details controller
	case "detail":
	 	$id = $_GET['id'];
	 	$query = $mysqli->query("SELECT * FROM project_list WHERE id ='$id' ");

		while ($row = $query->fetch_assoc()){
		 	$json = array('id' => $row['id'], 'name' => $row['name'], 'category' => $row['category'], 'demo_link' => $row['demo_link'], 'live_link' => $row['live_link'], 'image' =>str_replace('../','',$row['image']), 'details' => $row['details'],'ftp_details' => $row['ftp_details'],'cpanel_details' => $row['cpanel_details'],'status'=>$row['status']);
		 }
		 echo json_encode($json);
		 $mysqli->close();
	break;
	// Switch case for the add Project controller
	case "add":
		$dataString = $_POST['image'];

		define('UPLOAD_DIR', '../badges/');
		$img = $dataString;
		if (preg_match('/png/', $dataString)){
			$img = str_replace('data:image/png;base64,', '', $img);
			$file = UPLOAD_DIR . uniqid() . '.png';
		} else if (preg_match('/jpeg/', $dataString)) {
			$img = str_replace('data:image/jpeg;base64,', '', $img);
			$file = UPLOAD_DIR . uniqid() . '.jpg';
		}
else if (preg_match('/jpg/', $dataString)) {
			$img = str_replace('data:image/jpg;base64,', '', $img);
			$file = UPLOAD_DIR . uniqid() . '.jpg';
		}else{
			$file = '';
		}
		$img = str_replace(' ', '+', $img);
		$data = base64_decode($img);
		$success = file_put_contents($file, $data);

		$query = $mysqli->prepare('INSERT INTO project_list (name, category, demo_link, live_link, image, details, ftp_details, cpanel_details,status) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)');
		$query->bind_param('sssssssss', $_POST['name'], $_POST['category'], $_POST['demo_link'], $_POST['live_link'], $file, $_POST['details'], $_POST['ftp_details'],  $_POST['cpanel_details'],$_POST['status']);
		$query->execute();
		$mysqli->close();
	break;
	// Switch case for the edit Project controller
	case "edit":
		$id = $_GET['id'];
	     $dataString = $_POST['image'];

        $type = getB64Type($dataString);

		if (stripos($dataString, 'base64') !== false){
			define('UPLOAD_DIR', '../badges/');
			$img = $dataString;
			if ($type=='image/png'){

				$img = str_replace('data:image/png;base64,', '', $img);
				$file = UPLOAD_DIR . uniqid() . '.png';
			} else if ($type=='image/jpeg') {

				$img = str_replace('data:image/jpeg;base64,', '', $img);
				$file = UPLOAD_DIR . uniqid() . '.jpg';
			}
			else if ($type=='image/jpg') {

			$img = str_replace('data:image/jpg;base64,', '', $img);
			$file = UPLOAD_DIR . uniqid() . '.jpg';
		}
			$img = str_replace(' ', '+', $img);
			$data = base64_decode($img);
			$success = file_put_contents($file, $data);
		} else {
			$file = $_POST['image'];
		}
		$query = $mysqli->prepare('UPDATE project_list SET name = ?, category = ?, demo_link = ?, live_link = ?, image = ?, details = ?,ftp_details = ?,cpanel_details = ?,status = ? WHERE id = ?');
		$query->bind_param('sssssssssi', $_POST['name'], $_POST['category'], $_POST['demo_link'], $_POST['live_link'],$file, $_POST['details'], $_POST['ftp_details'], $_POST['cpanel_details'],$_POST['status'], $id);

		$query->execute();
		$mysqli->close();
	break;

	case "delete":
		$id = $_GET['id'];
		$query = $mysqli->prepare('DELETE FROM project_list WHERE id = ?');
		$query->bind_param('i', $id);
		$query->execute();
		$mysqli->close();
	break;







}
?>