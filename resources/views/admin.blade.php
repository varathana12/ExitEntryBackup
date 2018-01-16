<!DOCTYPE html>
<html lang="ja">
<head>
    <title>入退館管理システム</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="">
    <meta name="csrf-token" content="{{csrf_token()}}">
    <link rel="stylesheet" href={{ url('css/style.css') }}>
    <link rel="stylesheet" href={{ url('css/jquery.datetimepicker.css') }}>

</head>
<body class="admin">
    <div id="content"></div>

    <script src={{ mix('js/manifest.js') }}></script>
    <script src={{ mix('js/vendor.js') }}></script>
    <script src={{ mix('js/admin.js') }}></script>
</body>
</html>