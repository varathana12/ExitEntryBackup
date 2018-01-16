<!DOCTYPE html>
<html lang="ja">
<head>
    <title>入退館管理システム</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="">
</head>
<body style="margin: auto 15%;
position: relative;
    font-family: -apple-system, arial, 'ヒラギノ角ゴシック Pro', 'Hiragino Kaku Gothic Pro', '游ゴシック Medium', メイリオ, Meiryo, Osaka, 'ＭＳ Ｐゴシック', 'MS PGothic', sans-serif;
    word-break: break-all;
    padding: 0;
    border-top: 8px solid #008d55;">
<h1 style="text-align: center;"><img style="max-width: 40%; height: auto;" src="104.236.198.23/images/logo.png" alt="ウェブインパクト"></h1>
<div style="margin-top:35px">
    <p style="font-size: 16px">There are {{count($data)}} entrance data that have not been confirmed to leave.
        Please confirm the exit of the entrance data below.</p>
    @foreach($data as $key=>$admission)
        <div style="margin-top: 40px">
            <p>------------------------<br></p>
            <p><b>No:</b> {{$key+1}}</p>
            <p><b>Entry time:</b> {{$admission['entry_datetime']}}</p>
            <p><b>Member ID:</b> {{$admission['member_id']}}</p>
            <p><b>Company Name:</b> {{$admission['company_name']}}</p>
            <p><b>Name:</b> {{$admission['name']}}</p>
            <p><b>Number Of Visitors:</b> {{$admission['number_of_visitor']}}</p>
        </div>
    @endforeach
</div>
</body>
</html>