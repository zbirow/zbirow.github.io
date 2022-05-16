$file = file_get_contents("http://www.dpd.com.pl/tracking.asp?przycisk=Wyszukaj&p1=0000000870377S");
    preg_match('#<table border="0" cellpadding="0" cellspacing="0" class="subpage_modules">(.+?)</table><br>#', $file, $operator);
    echo $operator[1];
