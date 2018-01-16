import React from 'react'

const RecordListHead = (props) => {
    switch (props.navName) {
        case 'c3':
            return (
                <tr>
                    <th scope="col" className="w80">会員ID</th>
                    <th scope="col" className="w150">会社名</th>
                    <th scope="col" className="w150">氏名</th>
                    <th scope="col" className="w150">E-mailアドレス</th>
                    <th scope="col" className="w150">電話番号</th>
                    <th scope="col" className="w150">Registered Date Time</th>
                    <th scope="col" className="w150">Updated Date Time</th>
                </tr>
            );
        case 'c4':
            return (
                <tr>
                    <th scope="col" className="w80">会員ID</th>
                    <th scope="col" className="w80">入館人数</th>
                    <th scope="col" className="w150">入館日時</th>
                    <th scope="col" className="w150">退館日時</th>
                    <th scope="col" className="w80">退館確認者ID</th>
                    <th scope="col" className="w150">Registered Date Time</th>
                    <th scope="col" className="w150">Updated Date Time</th>
                </tr>
            );
        case 'c5':
            return (
                <tr>
                    <th scope="col" className="w100">退館確認者ID</th>
                    <th scope="col" className="w150">氏名</th>
                    <th scope="col" className="w150">Registered Date Time</th>
                    <th scope="col" className="w150">Updated Date Time</th>
                </tr>
            );
        case 'c6':
            return (
                <tr>
                    <th scope="col" className="w80">管理者ID</th>
                    <th scope="col" className="w150">E-mail アドレス</th>
                    <th scope="col" className="w150">パスワード</th>
                    <th scope="col" className="w150">Registered Date Time</th>
                    <th scope="col" className="w150">Updated Date Time</th>
                </tr>
            );
        case 'c7':
            return (
                <tr>
                    <th scope="col" className="w80">受付電話ID</th>
                    <th scope="col" className="w150">受付電話番号</th>
                    <th scope="col" className="w150">Registered Date Time</th>
                    <th scope="col" className="w150">Updated Date Time</th>
                </tr>
            );
        default:
            return (
                <tr>
                    <th scope="col" className="w80">会員ID</th>
                    <th scope="col">会社名</th>
                    <th scope="col">氏名</th>
                    <th scope="col">E-mailアドレス</th>
                    <th scope="col" className="w100">電話番号</th>
                    <th scope="col">Registered Date Time</th>
                    <th scope="col">Updated Date Time</th>
                </tr>
            )
    }
};

export default RecordListHead