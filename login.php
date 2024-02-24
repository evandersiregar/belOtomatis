

<!DOCTYPE html>
<html lang="en">

<head>
    <title>Login | Bel Sekolah</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="color-scheme" content="light only" />
    <link rel="stylesheet" href="styling/buatJadwalStyling.css" />
    <link rel="canonical" href="index.html" />
    <link
        href="https://fonts.googleapis.com/css2?display=swap&amp;family=Raleway:ital,wght@0,600;0,900;1,600;1,900&amp;family=Source+Sans+Pro:ital,wght@0,300;1,300"
        rel="stylesheet" type="text/css" />

    <noscript>
        <style>
        body {
            overflow: auto !important;
        }

        body:after {
            display: none !important;
        }

        #main>.inner {
            opacity: 1 !important;
        }

        #main {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
            filter: none !important;
        }

        #main>.inner>section {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
            filter: none !important;
        }
        </style>
    </noscript>
</head>

<body class="is-loading">
    <div id="wrapper">
        <div id="main">
            <div class="inner">
                <section id="home-section">
                    <div id="columns01" class="container default">
                        <div class="wrapper">
                            <div class="inner">
                                <h1 id="text04">Bel Sekolah</h1>
                                <p class="text05">
                                    Harap masuk terlebih dahulu sebelum mengelola jadwal
                                </p>
                            </div>
                        </div>
                    </div>
                    <form id="form01" method="post" action="auth.php">
                        <div class="inner">

                            <div class="field">
                                <input type="text" autocomplete="off" name="username" id="form01-name"
                                    placeholder="Masukkan Username" required />
                            </div>
                            <div class="field">
                                <input type="password" autocomplete="off" name="password" id="passwd"
                                    placeholder="Masukkan Password" style="width: 400px;" required />
                            </div>
                            <div class="actions">
                                <button type="submit" >Login</button>
                            </div>
                        </div>
                        <input type="hidden" name="id" value="form01" />
                    </form>
                    <div id="columns02" class="container default">
                        <div class="wrapper">
                            <div class="inner">
                                <p id="text02">© Project TA. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="done-section">
                    <div id="columns03" class="container default">
                        <div class="wrapper">
                            <div class="inner">
                                <h2 id="text01">Berhasil dibuat</h2>
                                <p id="text03">
                                    Bel akan dibunyikan pada waktu yang telah ditentukan
                                </p>
                                <ul id="buttons01" class="buttons">
                                    <li><a href="#home" class="button n01">Back</a></li>
                                </ul>
                            </div>
                        </div>
                    </div </section>
            </div>
        </div>
    </div>
    <script src="styling/butJadwalJS.js"></script>
</body>


</html>