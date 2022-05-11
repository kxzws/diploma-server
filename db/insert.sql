USE kursach;
-- 4 + 7 + 7 + 12 + 6 + 72 = 108+ записей

INSERT INTO users (userName, userPass, isAdmin, email, phoneNumber) VALUES
('admin', md5('1122'), true, 'admin@mail.com', '80(50)111-22-33'),
('kxzws', md5('12345679'), false, 'user1@mail.com', '80(33)777-77-77'),
('hobbit', md5('1235'), false, 'user2@mail.com', '80(33)777-25-77'),
('ghoul', md5('1243'), false, 'xxx@mail.com', '80(33)444-25-77'); 
SELECT * FROM users;

INSERT INTO birdGenus (genusName, internationalName, foundYear, description) VALUES
('Синицы', 'Parus', 1758, 'Типичный представитель рода — большая синица (Parus major) широко распространена на территории России.'),
('Воробьи', 'Passer', 1760, 'Как правило, это небольшие птицы с коротким хвостом и коротким мощным клювом.'),
('Голубиные', 'Columbidae', 1820, 'Семейство состоит из примерно 300 видов, разбитых на 41 род. К семейству относятся голуби и горлицы, широко распространённые в Старом и Новом Свете.'),
('Врановые', 'Corvidae', 1825, 'У многих представителей семейства оперение чёрное, но есть и ярко окрашенные виды. Питаются преимущественно насекомыми, отчасти зёрнами. У крупных северных видов значительное место занимает охота за яйцами и птенцами других птиц, поиск падали и грабёж.'),
('Утиные', 'Anatidae', 1820, 'Некоторые виды, такие как кряква или серый гусь, с древних времён были одомашнены человеком и разводятся ради мяса, яиц и пуха, другие являются объектом охотничьего промысла.'),
('Аисты', 'Ciconia', 1760, 'У античных писателей и в средневековых бестиариях можно встретить упоминание о легенде, что аисты кормят своих родителей, когда те уже не способны сами позаботиться о себе.'),
('Цаплевые', 'Ardeidae', 1820, 'Большинство видов гнездится колониями, иногда вперемешку с другими видами птиц.');
SELECT * FROM birdGenus;

INSERT INTO protectionStatus (shortName, longName, description) VALUES
('EX', 'Исчезнувшие', 'Охранный статус, присваиваемый организму или группе организмов (таксонов), не встречавшихся как в дикой природе с момента последнего официально зарегистрированного наблюдения, так и не сохранившихся в неволе'),
('EW', 'Исчезнувшие в дикой природе', ' Охранный статус, присваиваемый биологическим видам или таксонам, представители которых сохранились только в неволе'),
('CR', 'Находящиеся на грани полного исчезновения', 'Охранный статус, который Международный Союз Охраны Природы (МСОП) присваивает биологическим видам или инфравидовым таксонам, имеющим чрезвычайно высокий риск исчезновения в дикой природе'),
('EN', 'Вымирающие', 'Биологические виды, которые подвержены угрозе вымирания из-за своей критически малой численности либо воздействия определенных факторов окружающей среды'),
('VU', 'Уязвимые', 'Охранный статус, присваиваемый биологическим видам, которые находятся под риском стать вымирающими'),
('NT', 'Близкие к уязвимому положению', 'Этот статус предоставляется видам или нижним таксонам, которые могут рассматриваться как находящиеся под опасностью исчезновения в ближайшем будущем, хотя в настоящее время они не претендуют на статус уязвимых'),
('LC', 'Вызывающие наименьшие опасения', 'Охранный статус, который Международный союз охраны природы присваивает биологическим видам или инфравидовым таксонам, не входящим в какую-либо иную категорию');
SELECT * FROM protectionStatus;

INSERT INTO birdSpecies (speciesName, length, weight, wingspan, description, idGenus, idPrS) VALUES
('Большая синица', 0.15, 17.5, 0.24, 'Подвижная, вертлявая птица. В Европе самая крупная синица — размером примерно с воробья, имеет достаточно длинный хвост', 1, 7),
('Домовый воробей', 0.16, 29, null, 'Будучи синантропным видом — постоянным сожителем человека, домовый воробей хорошо приспособлен к жизни в обстановке, меняющейся под воздействием хозяйственной деятельности человека', 2, 7),
('Горлица', 0.3, 125, null, 'Смеющаяся горлица разводится как клеточная птица, в природе не известна', 3, 7),
('Галка', 0.36, 200, 0.7, 'Шумная птица. Наиболее частый крик, используемый как для коммуникации, так и для привлечения внимания — энергичное и довольно мелодичное «кай» или «кьяа»', 4, 7),
('Серая ворона', 0.5, 600, 1, 'Ворона прекрасно различает и соответственно реагирует на просто прогуливающегося человека и на охотника с ружьём', 4, 7),
('Чёрный ворон', 0.5, null, null, 'Грачи, как правило, живут стаями, а вороны — поодиночке', 4, 7),
('Черногорлая сорочья сойка', 0.67, 230, null, 'Крики разнообразные, громкие, хриплые, иногда подобны звукам, издаваемым попугаевыми', 4, 7),
('Кряква', 0.6, 1500, 0.9, 'Частично перелётная птица. Населяет пресные и слегка солоноватые водоёмы. В последние годы многие птицы зимуют на незамерзающих водоёмах в крупных городах и их окрестностях', 5, 7),
('Чёрный аист', null, null, null, 'Образ жизни чёрного аиста изучен слабо. Эта скрытная птица, в отличие от белого аиста, не любит соседства с человеком и предпочитает селиться в глухих, старых лесах на равнинах и предгорьях возле водоёмов — лесных озёр, рек, болот', 6, 6),
('Белый аист', 1.2, 4500, 2, 'Когда крылья у аиста сложены, создаётся впечатление, что вся задняя часть тела аиста чёрная. Отсюда его украинское название — черногуз', 6, 7),
('Малая выпь', 0.36, 140, 0.45, 'Летает не очень охотно, только на небольшие расстояния, очень низко над зарослями или поверхностью воды', 7, 4),
('Усатая синица', 0.15, null, null, 'Её призывный крик узнаваем по оживлённому, звучащему в нос «пшинг» в камышовых зарослях, далёкому раскатистому «чирр» и тихому щёлкающему «петт»', 2, 7);
SELECT * FROM birdSpecies;

INSERT INTO preserves (presName, presOwner, area, foundYear, address) VALUES
('Березинский биосферный заповедник', 'Андрей Прокошин', 85.2, 1925, 'Беларусь, на границе Витебской и Минской областей'), 
('Полесский государственный радиационно-экологический заповедник', 'Михаил Рубащенко', 215, 1988, 'зона отчуждения Чернобыльской АЭС'),
('Беловежская пуща', 'Управление делами Президента Республики Беларусь', 141, 1979, 'на границе Беларуси и Польши'),
('Нарочанский', 'Василий Коржов', 87.3, 1999, 'Беларусь, на границе Минской и Витебской областей'),
('Браславские озёра', 'Михаил Чичко', 71.5, 1995, 'Беларусь, запад Витебской области'),
('Припятский', 'Управление делами Президента Республики Беларусь', 85.8, 1969, 'Беларусь, Гомельская область');
SELECT * FROM preserves;

INSERT INTO preserves2birdSpecies (idSpecies, idPres) -- все птицы есть во всех заповедниках
(SELECT idSpecies, idPres FROM birdSpecies
JOIN preserves);
SELECT * FROM preserves2birdSpecies;
