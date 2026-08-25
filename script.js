/* ============================= CONTENT ============================= */

// Each word carries a difficulty tier: easy / medium / legendary.
// Puzzles draw from these tiers (see DIFFICULTY below) so the same handful
// of words never gets recycled every round.
const WORDS = {
  metals: { label:"Metals", icon:"⛏️", color:"#8a94b8",
    list:[
      {word:"IRON", tier:"easy", clue:"Common gray metal, strong and magnetic"},
      {word:"GOLD", tier:"easy", clue:"Precious yellow metal, prized by kings"},
      {word:"TIN", tier:"easy", clue:"Soft metal once used to coat food cans"},
      {word:"LEAD", tier:"easy", clue:"Heavy soft metal, once used in old pipes"},
      {word:"ZINC", tier:"easy", clue:"Bluish-white metal used to coat steel"},
      {word:"ORE", tier:"easy", clue:"Rock dug up for its metal content"},
      {word:"RUST", tier:"easy", clue:"Reddish coating iron gets over time"},
      {word:"BLADE", tier:"easy", clue:"The sharp edge of a sword"},
      {word:"ANVIL", tier:"easy", clue:"Heavy iron block a smith hammers on"},
      {word:"STEEL", tier:"easy", clue:"Iron alloyed with carbon for blades"},
      {word:"COPPER", tier:"medium", clue:"Reddish metal used for wiring and coins"},
      {word:"BRONZE", tier:"medium", clue:"An alloy of copper and tin"},
      {word:"NICKEL", tier:"medium", clue:"Silvery metal used in coins and alloys"},
      {word:"SILVER", tier:"medium", clue:"Shiny white precious metal"},
      {word:"FORGE", tier:"medium", clue:"Where a blacksmith heats and shapes metal"},
      {word:"CHROME", tier:"medium", clue:"Shiny metal plating that resists rust"},
      {word:"PLATINUM", tier:"legendary", clue:"Rare silvery-white metal, denser than gold"},
      {word:"MERCURY", tier:"legendary", clue:"The only metal that's liquid at room temperature"},
      {word:"TITANIUM", tier:"legendary", clue:"Strong, lightweight metal used in aircraft"},
    ]},
  food: { label:"Food", icon:"🍲", color:"#d99a5b",
    list:[
      {word:"EGG", tier:"easy", clue:"Laid by hens, cracked into a pan"},
      {word:"MEAT", tier:"easy", clue:"Food carved from an animal"},
      {word:"FISH", tier:"easy", clue:"Caught from rivers or the sea"},
      {word:"SOUP", tier:"easy", clue:"A warm dish served in a bowl"},
      {word:"CAKE", tier:"easy", clue:"Sweet baked treat for celebrations"},
      {word:"STEW", tier:"easy", clue:"Meat and vegetables simmered slowly"},
      {word:"WINE", tier:"easy", clue:"Fermented drink made from grapes"},
      {word:"RICE", tier:"easy", clue:"Small grains, a staple with many meals"},
      {word:"MILK", tier:"easy", clue:"White drink taken fresh from a cow"},
      {word:"BREAD", tier:"easy", clue:"Baked from flour, water, and yeast"},
      {word:"HONEY", tier:"medium", clue:"Sweet food made by bees"},
      {word:"ONION", tier:"medium", clue:"Layered bulb that brings tears when cut"},
      {word:"APPLE", tier:"medium", clue:"Crisp fruit that grows on an orchard tree"},
      {word:"GRAPE", tier:"medium", clue:"Small fruit crushed to make wine"},
      {word:"BUTTER", tier:"medium", clue:"Churned from cream, spread on bread"},
      {word:"GARLIC", tier:"medium", clue:"Pungent bulb used to flavor almost everything"},
      {word:"CHEESE", tier:"medium", clue:"Made from curdled milk, aged in a cellar"},
      {word:"PEPPER", tier:"medium", clue:"Ground spice that makes you sneeze"},
      {word:"PUDDING", tier:"legendary", clue:"Soft, sweet dessert served after a feast"},
      {word:"SAUSAGE", tier:"legendary", clue:"Meat stuffed into a casing"},
      {word:"PORRIDGE", tier:"legendary", clue:"Boiled grain served warm for breakfast"},
    ]},
  grain: { label:"Grain", icon:"🌾", color:"#c9a63f",
    list:[
      {word:"CORN", tier:"easy", clue:"Golden kernels growing on a cob"},
      {word:"OATS", tier:"easy", clue:"A grain often eaten at breakfast"},
      {word:"RYE", tier:"easy", clue:"A dark grain used in hearty bread"},
      {word:"BRAN", tier:"easy", clue:"The tough outer layer of a grain"},
      {word:"SEED", tier:"easy", clue:"What a farmer plants to grow more grain"},
      {word:"HUSK", tier:"easy", clue:"The dry outer covering removed before milling"},
      {word:"CHAFF", tier:"easy", clue:"Worthless husks separated from grain by wind"},
      {word:"SHEAF", tier:"easy", clue:"A bundle of grain stalks tied together"},
      {word:"WHEAT", tier:"easy", clue:"The main grain milled into flour"},
      {word:"FLOUR", tier:"easy", clue:"Fine powder ground from wheat"},
      {word:"GRIST", tier:"medium", clue:"Grain that's ready to be ground"},
      {word:"BARLEY", tier:"medium", clue:"A grain used in stews and brewing"},
      {word:"MILLET", tier:"medium", clue:"A small round grain grown in dry soil"},
      {word:"SICKLE", tier:"medium", clue:"Curved blade used to cut stalks of grain"},
      {word:"KERNEL", tier:"medium", clue:"A single seed or grain"},
      {word:"QUINOA", tier:"medium", clue:"Ancient grain prized for its protein"},
      {word:"SORGHUM", tier:"legendary", clue:"A drought-hardy grain used for flour and syrup"},
      {word:"HARVEST", tier:"legendary", clue:"The season when crops are gathered in"},
      {word:"GRANARY", tier:"legendary", clue:"A storehouse built to keep grain dry"},
      {word:"BUCKWHEAT", tier:"legendary", clue:"A hearty grain used in pancakes and noodles"},
    ]},
  animals: { label:"Animals", icon:"🐑", color:"#7fa876",
    list:[
      {word:"PIG", tier:"easy", clue:"Farm animal that roots in the mud"},
      {word:"COW", tier:"easy", clue:"Farm animal milked every morning"},
      {word:"HEN", tier:"easy", clue:"Female bird that lays the morning eggs"},
      {word:"FOX", tier:"easy", clue:"Clever red-furred hunter of the henhouse"},
      {word:"OWL", tier:"easy", clue:"Night bird known for its silent flight"},
      {word:"DUCK", tier:"easy", clue:"Waterfowl that waddles and quacks"},
      {word:"WOLF", tier:"easy", clue:"Wild, howling relative of the dog"},
      {word:"DEER", tier:"easy", clue:"Graceful antlered animal at the wood's edge"},
      {word:"BEAR", tier:"easy", clue:"Large, strong animal that hibernates in winter"},
      {word:"GOAT", tier:"easy", clue:"Horned climber that eats almost anything"},
      {word:"HAWK", tier:"easy", clue:"Sharp-eyed bird of prey"},
      {word:"SHEEP", tier:"medium", clue:"Woolly animal kept for its fleece"},
      {word:"HORSE", tier:"medium", clue:"Ridden and used to pull carts"},
      {word:"CRANE", tier:"medium", clue:"Tall wading bird with a long neck"},
      {word:"OTTER", tier:"medium", clue:"Playful animal that swims in rivers"},
      {word:"FALCON", tier:"medium", clue:"Swift hunting bird trained by falconers"},
      {word:"BADGER", tier:"medium", clue:"Stout burrowing animal with a striped face"},
      {word:"RABBIT", tier:"medium", clue:"Long-eared animal that multiplies quickly"},
      {word:"STALLION", tier:"legendary", clue:"A powerful, unbred male horse"},
      {word:"LIVESTOCK", tier:"legendary", clue:"Animals raised on a farm for work or food"},
      {word:"SHEPHERD", tier:"legendary", clue:"Someone who watches over a flock of sheep"},
    ]},
  magic: { label:"Magic", icon:"🔮", color:"#9b7fc4",
    list:[
      {word:"HEX", tier:"easy", clue:"A curse muttered under one's breath"},
      {word:"ORB", tier:"easy", clue:"A glowing sphere used to see far-off places"},
      {word:"MIST", tier:"easy", clue:"Magical fog that swallows a path"},
      {word:"SEAL", tier:"easy", clue:"A magical mark that binds a promise"},
      {word:"OMEN", tier:"easy", clue:"A sign believed to predict what's coming"},
      {word:"RUNE", tier:"easy", clue:"An ancient symbol carved with power"},
      {word:"WAND", tier:"easy", clue:"A tool for channeling magic"},
      {word:"SPELL", tier:"easy", clue:"A magical formula spoken aloud"},
      {word:"CHARM", tier:"easy", clue:"A small trinket believed to hold magic"},
      {word:"POTION", tier:"medium", clue:"A brewed magical liquid"},
      {word:"SCROLL", tier:"medium", clue:"Old parchment rolled up, holding a spell"},
      {word:"AMULET", tier:"medium", clue:"A charm worn for protection"},
      {word:"PHANTOM", tier:"medium", clue:"A ghostly figure that vanishes at dawn"},
      {word:"ALCHEMY", tier:"medium", clue:"The ancient art of transforming matter"},
      {word:"ENCHANT", tier:"medium", clue:"To place a spell upon something"},
      {word:"SORCERY", tier:"medium", clue:"The practice of dark or powerful magic"},
      {word:"ILLUSION", tier:"legendary", clue:"A magical trick that fools the eye"},
      {word:"CAULDRON", tier:"legendary", clue:"A large pot used for brewing potions"},
      {word:"WIZARDRY", tier:"legendary", clue:"Skill and mastery in the magical arts"},
      {word:"INCANTATION", tier:"legendary", clue:"A set of words spoken to cast a spell"},
    ]},
  cloth: { label:"Cloth", icon:"🧵", color:"#c77dab",
    list:[
      {word:"WOOL", tier:"easy", clue:"Soft fiber sheared from a sheep"},
      {word:"SILK", tier:"easy", clue:"Fine thread spun by a caterpillar"},
      {word:"YARN", tier:"easy", clue:"Twisted fiber ready for knitting"},
      {word:"LOOM", tier:"easy", clue:"Frame used to weave threads into cloth"},
      {word:"HEMP", tier:"easy", clue:"Tough plant fiber used for rope and cloth"},
      {word:"FLAX", tier:"easy", clue:"Plant fiber spun into linen thread"},
      {word:"DYE", tier:"easy", clue:"Substance used to color fabric"},
      {word:"SEAM", tier:"easy", clue:"Line where two pieces of cloth are stitched"},
      {word:"SPUN", tier:"easy", clue:"Twisted into thread, as raw fiber"},
      {word:"HEM", tier:"easy", clue:"Folded and stitched edge of a garment"},
      {word:"WEAVE", tier:"medium", clue:"To interlace threads into cloth"},
      {word:"THREAD", tier:"medium", clue:"A thin strand used for sewing or weaving"},
      {word:"STITCH", tier:"medium", clue:"A single loop made by needle and thread"},
      {word:"FABRIC", tier:"medium", clue:"Cloth made by weaving or knitting fibers"},
      {word:"SPOOL", tier:"medium", clue:"A cylinder that thread is wound around"},
      {word:"NEEDLE", tier:"medium", clue:"Slender tool used to sew fabric together"},
      {word:"COTTON", tier:"medium", clue:"Soft fiber picked from a plant's boll"},
      {word:"TAPESTRY", tier:"legendary", clue:"A woven picture hung on a wall"},
      {word:"EMBROIDER", tier:"legendary", clue:"To decorate cloth with needle and colored thread"},
      {word:"SPINDLE", tier:"legendary", clue:"A rod used to twist fiber into thread"},
      {word:"SEAMSTRESS", tier:"legendary", clue:"Someone skilled at sewing and mending cloth"},
    ]},
  sea: { label:"Sea", icon:"🎣", color:"#5b9bc4",
    list:[
      {word:"FIN", tier:"easy", clue:"Thin flap a fish uses to swim"},
      {word:"NET", tier:"easy", clue:"Woven mesh used to catch fish"},
      {word:"BAIT", tier:"easy", clue:"Food used to lure a fish onto a hook"},
      {word:"HOOK", tier:"easy", clue:"Curved metal barb on a fishing line"},
      {word:"REEF", tier:"easy", clue:"Ridge of coral beneath the waves"},
      {word:"TIDE", tier:"easy", clue:"Rise and fall of the sea's water level"},
      {word:"WAVE", tier:"easy", clue:"Ridge of water moving across the sea"},
      {word:"CRAB", tier:"easy", clue:"Sideways-walking creature with claws"},
      {word:"EEL", tier:"easy", clue:"Long, snake-like fish"},
      {word:"ROD", tier:"easy", clue:"Pole used to cast a fishing line"},
      {word:"ANCHOR", tier:"medium", clue:"Heavy hook that keeps a ship in place"},
      {word:"HARBOR", tier:"medium", clue:"Sheltered water where ships dock safely"},
      {word:"VESSEL", tier:"medium", clue:"A general word for a boat or ship"},
      {word:"DOLPHIN", tier:"medium", clue:"Playful, intelligent sea mammal"},
      {word:"LOBSTER", tier:"medium", clue:"Clawed shellfish pulled up in a trap"},
      {word:"CURRENT", tier:"medium", clue:"A steady flow of water through the sea"},
      {word:"SEAWEED", tier:"medium", clue:"Plant-like growth drifting in the shallows"},
      {word:"FISHERMAN", tier:"legendary", clue:"Someone who makes a living catching fish"},
      {word:"SHIPWRECK", tier:"legendary", clue:"The ruined remains of a sunken vessel"},
      {word:"LIGHTHOUSE", tier:"legendary", clue:"A tower that guides ships safely to shore"},
      {word:"HARPOON", tier:"legendary", clue:"A barbed spear used to hunt large sea creatures"},
    ]},
  stone: { label:"Stone", icon:"🪨", color:"#9c9484",
    list:[
      {word:"ROCK", tier:"easy", clue:"Hard mineral material dug from the earth"},
      {word:"CLAY", tier:"easy", clue:"Soft earth shaped and fired into bricks"},
      {word:"MUD", tier:"easy", clue:"Wet earth once used to bind old walls"},
      {word:"WALL", tier:"easy", clue:"Vertical structure built to enclose or divide"},
      {word:"ARCH", tier:"easy", clue:"Curved structure that spans an opening"},
      {word:"SAND", tier:"easy", clue:"Fine grains mixed into mortar"},
      {word:"FLINT", tier:"easy", clue:"Hard stone that sparks when struck"},
      {word:"SLAB", tier:"easy", clue:"Flat, thick piece of cut stone"},
      {word:"BRICK", tier:"easy", clue:"Block of baked clay used in walls"},
      {word:"MASON", tier:"easy", clue:"Someone skilled at building with stone"},
      {word:"GRANITE", tier:"medium", clue:"Hard, speckled stone used for grand buildings"},
      {word:"MARBLE", tier:"medium", clue:"Polished stone prized for statues and floors"},
      {word:"MORTAR", tier:"medium", clue:"Paste that binds bricks or stones together"},
      {word:"RUBBLE", tier:"medium", clue:"Broken fragments of stone or brick"},
      {word:"QUARRY", tier:"medium", clue:"A pit where stone is cut from the ground"},
      {word:"CHISEL", tier:"medium", clue:"Tool used to carve or shape stone"},
      {word:"BOULDER", tier:"medium", clue:"A large rounded rock"},
      {word:"FOUNDATION", tier:"legendary", clue:"The base a structure is built upon"},
      {word:"SCAFFOLD", tier:"legendary", clue:"Temporary framework builders stand on"},
      {word:"CORNERSTONE", tier:"legendary", clue:"The first stone set in a building's foundation"},
      {word:"MASONRY", tier:"legendary", clue:"The craft of building with stone or brick"},
    ]},
  herbs: { label:"Herbs", icon:"🌿", color:"#a3a15c",
    list:[
      {word:"MINT", tier:"easy", clue:"Fragrant leaf used to freshen breath or tea"},
      {word:"SAGE", tier:"easy", clue:"Silvery-green herb burned or used in cooking"},
      {word:"ROOT", tier:"easy", clue:"Underground part of a plant, often used in remedies"},
      {word:"LEAF", tier:"easy", clue:"Flat green part of a plant, picked for tea"},
      {word:"BALM", tier:"easy", clue:"Soothing ointment made from healing herbs"},
      {word:"HERB", tier:"easy", clue:"A plant used for flavor, scent, or medicine"},
      {word:"DILL", tier:"easy", clue:"Feathery herb often paired with pickles"},
      {word:"BUD", tier:"easy", clue:"A plant's unopened flower or new growth"},
      {word:"BASIL", tier:"easy", clue:"Fragrant herb common in savory cooking"},
      {word:"THYME", tier:"easy", clue:"Small-leaved herb used to season stews"},
      {word:"GINGER", tier:"medium", clue:"Spicy root used to settle the stomach"},
      {word:"NETTLE", tier:"medium", clue:"Stinging plant also used in old remedies"},
      {word:"FENNEL", tier:"medium", clue:"Aromatic herb with a mild licorice taste"},
      {word:"REMEDY", tier:"medium", clue:"A treatment made to ease an ailment"},
      {word:"ELIXIR", tier:"medium", clue:"A potion believed to cure or heal"},
      {word:"PARSLEY", tier:"medium", clue:"Bright green herb used as garnish and flavor"},
      {word:"SAFFRON", tier:"medium", clue:"Rare, costly spice from a crocus flower"},
      {word:"ROSEMARY", tier:"legendary", clue:"Piney herb often paired with roasted meat"},
      {word:"LAVENDER", tier:"legendary", clue:"Fragrant purple herb used to calm the mind"},
      {word:"CHAMOMILE", tier:"legendary", clue:"Gentle flower brewed into a calming tea"},
      {word:"APOTHECARY", tier:"legendary", clue:"Old-world shop that prepared herbal medicines"},
    ]},
  nature: { label:"Nature", icon:"🌲", color:"#4a8f7f",
    list:[
      {word:"HILL", tier:"easy", clue:"A raised area of land, smaller than a mountain"},
      {word:"POND", tier:"easy", clue:"A small body of still water"},
      {word:"LAKE", tier:"easy", clue:"A large body of water surrounded by land"},
      {word:"VINE", tier:"easy", clue:"A climbing or trailing plant"},
      {word:"MOSS", tier:"easy", clue:"Soft green growth on damp rocks or bark"},
      {word:"FERN", tier:"easy", clue:"Feathery green plant with no flowers"},
      {word:"CAVE", tier:"easy", clue:"A hollow space carved into rock or a hillside"},
      {word:"DUSK", tier:"easy", clue:"The dim light just after sunset"},
      {word:"DAWN", tier:"easy", clue:"The first light of morning"},
      {word:"GLEN", tier:"easy", clue:"A narrow, secluded valley"},
      {word:"RIVER", tier:"medium", clue:"A large natural stream flowing to the sea"},
      {word:"CANYON", tier:"medium", clue:"A deep gorge carved by a river"},
      {word:"MEADOW", tier:"medium", clue:"A field of grass and wildflowers"},
      {word:"VALLEY", tier:"medium", clue:"Low land between hills or mountains"},
      {word:"FOREST", tier:"medium", clue:"A large area densely covered in trees"},
      {word:"BREEZE", tier:"medium", clue:"A gentle, light wind"},
      {word:"GROVE", tier:"medium", clue:"A small group of trees growing together"},
      {word:"WATERFALL", tier:"legendary", clue:"A stream of water falling from a height"},
      {word:"WILDERNESS", tier:"legendary", clue:"Untamed land left in its natural state"},
      {word:"AVALANCHE", tier:"legendary", clue:"A mass of snow sliding suddenly down a mountain"},
      {word:"HORIZON", tier:"legendary", clue:"The line where the earth seems to meet the sky"},
    ]},
  war: { label:"War & Defense", icon:"⚔️", color:"#8f3d35",
    list:[
      {word:"BOW", tier:"easy", clue:"Weapon that shoots arrows using a curved frame"},
      {word:"AXE", tier:"easy", clue:"Sharp-edged tool or weapon swung to chop or strike"},
      {word:"FORT", tier:"easy", clue:"A fortified stronghold built for defense"},
      {word:"DUEL", tier:"easy", clue:"A formal fight between two challengers"},
      {word:"CAMP", tier:"easy", clue:"A temporary settlement for soldiers"},
      {word:"ARMY", tier:"easy", clue:"An organized force of soldiers"},
      {word:"RAID", tier:"easy", clue:"A sudden, surprise attack"},
      {word:"TRUCE", tier:"easy", clue:"A temporary halt to fighting"},
      {word:"GUARD", tier:"easy", clue:"Someone posted to watch and protect"},
      {word:"SIEGE", tier:"easy", clue:"A prolonged military blockade of a stronghold"},
      {word:"SHIELD", tier:"medium", clue:"A protective barrier carried to block blows"},
      {word:"ARROW", tier:"medium", clue:"A pointed shaft shot from a bow"},
      {word:"SOLDIER", tier:"medium", clue:"A person who serves in an army"},
      {word:"VICTORY", tier:"medium", clue:"A win achieved in battle or conflict"},
      {word:"ARMOR", tier:"medium", clue:"Protective covering worn into battle"},
      {word:"SWORD", tier:"medium", clue:"A bladed weapon with a hilt and long edge"},
      {word:"HELMET", tier:"medium", clue:"Protective headgear worn in combat"},
      {word:"CATAPULT", tier:"legendary", clue:"Siege engine used to hurl heavy stones"},
      {word:"STRONGHOLD", tier:"legendary", clue:"A well-defended fortress or base"},
      {word:"BATTALION", tier:"legendary", clue:"A large organized body of troops"},
      {word:"SKIRMISH", tier:"legendary", clue:"A brief, minor clash between small forces"},
    ]},
  royalty: { label:"Royalty & Court", icon:"👑", color:"#5c4a8f",
    list:[
      {word:"KING", tier:"easy", clue:"Male ruler of a kingdom"},
      {word:"DUKE", tier:"easy", clue:"A noble ranking just below a prince"},
      {word:"LORD", tier:"easy", clue:"A titled nobleman or ruler of an estate"},
      {word:"HEIR", tier:"easy", clue:"The one next in line to inherit the throne"},
      {word:"OATH", tier:"easy", clue:"A solemn, formal promise"},
      {word:"COURT", tier:"easy", clue:"The ruler's household and closest advisers"},
      {word:"CROWN", tier:"easy", clue:"Jeweled headpiece worn by a monarch"},
      {word:"REALM", tier:"easy", clue:"A king or queen's kingdom or domain"},
      {word:"NOBLE", tier:"easy", clue:"A person of high inherited rank"},
      {word:"REIGN", tier:"easy", clue:"The period a monarch rules"},
      {word:"PALACE", tier:"medium", clue:"The grand residence of a monarch"},
      {word:"TREATY", tier:"medium", clue:"A formal agreement between rulers or states"},
      {word:"TRIBUTE", tier:"medium", clue:"Payment made by one ruler to another for protection"},
      {word:"SCEPTER", tier:"medium", clue:"Ornamental staff carried as a symbol of authority"},
      {word:"DYNASTY", tier:"medium", clue:"A line of rulers from the same family"},
      {word:"COUNCIL", tier:"medium", clue:"A group of advisers who guide a ruler"},
      {word:"REGENT", tier:"medium", clue:"Someone who rules in place of a monarch"},
      {word:"CORONATION", tier:"legendary", clue:"The ceremony where a monarch is crowned"},
      {word:"SOVEREIGN", tier:"legendary", clue:"A supreme ruler, or having ultimate authority"},
      {word:"ARISTOCRACY", tier:"legendary", clue:"The highest class of hereditary nobility"},
      {word:"SUCCESSION", tier:"legendary", clue:"The order in which the throne is inherited"},
    ]},
  music: { label:"Music", icon:"🎻", color:"#3f8fa3",
    list:[
      {word:"DRUM", tier:"easy", clue:"Percussion instrument struck with hands or sticks"},
      {word:"HORN", tier:"easy", clue:"Brass instrument played by buzzing the lips"},
      {word:"HARP", tier:"easy", clue:"Large stringed instrument plucked by hand"},
      {word:"FLUTE", tier:"easy", clue:"Slender wind instrument played sideways"},
      {word:"CHOIR", tier:"easy", clue:"A group of singers performing together"},
      {word:"TEMPO", tier:"easy", clue:"The speed at which music is played"},
      {word:"CHORD", tier:"easy", clue:"Several notes played together in harmony"},
      {word:"NOTE", tier:"easy", clue:"A single musical sound of a set pitch"},
      {word:"TUNE", tier:"easy", clue:"A pleasing sequence of musical notes"},
      {word:"SONG", tier:"easy", clue:"A piece of music meant to be sung"},
      {word:"BALLAD", tier:"medium", clue:"A slow song that tells a story"},
      {word:"FIDDLE", tier:"medium", clue:"A folk term for a violin"},
      {word:"MELODY", tier:"medium", clue:"A pleasing sequence of single musical notes"},
      {word:"RHYTHM", tier:"medium", clue:"The pattern of beats in a piece of music"},
      {word:"TRUMPET", tier:"medium", clue:"Brass instrument with a bright, piercing tone"},
      {word:"CYMBAL", tier:"medium", clue:"A flat metal disc crashed to punctuate a beat"},
      {word:"LYRICS", tier:"medium", clue:"The words sung in a song"},
      {word:"MINSTREL", tier:"legendary", clue:"A traveling musician and storyteller"},
      {word:"SYMPHONY", tier:"legendary", clue:"A long orchestral work in several movements"},
      {word:"HARMONICA", tier:"legendary", clue:"Small handheld wind instrument played by breathing through it"},
      {word:"SERENADE", tier:"legendary", clue:"A romantic song performed beneath someone's window"},
    ]},
  weather: { label:"Weather", icon:"🌦️", color:"#8aa8b8",
    list:[
      {word:"FOG", tier:"easy", clue:"A thick cloud of mist near the ground"},
      {word:"WIND", tier:"easy", clue:"Air moving across the land"},
      {word:"RAIN", tier:"easy", clue:"Water falling from clouds"},
      {word:"SNOW", tier:"easy", clue:"Soft white flakes of frozen water"},
      {word:"HAIL", tier:"easy", clue:"Balls of ice that fall during a storm"},
      {word:"GALE", tier:"easy", clue:"A very strong, sweeping wind"},
      {word:"FROST", tier:"easy", clue:"A thin layer of ice on a cold morning"},
      {word:"CLOUD", tier:"easy", clue:"A visible mass of water vapor in the sky"},
      {word:"STORM", tier:"easy", clue:"A violent disturbance of wind and rain"},
      {word:"SLEET", tier:"easy", clue:"A mix of rain and snow falling together"},
      {word:"THUNDER", tier:"medium", clue:"The rumbling sound that follows lightning"},
      {word:"DROUGHT", tier:"medium", clue:"A long period without any rain"},
      {word:"RAINBOW", tier:"medium", clue:"An arc of colors that appears after rain"},
      {word:"MONSOON", tier:"medium", clue:"A seasonal wind bringing heavy rainfall"},
      {word:"CYCLONE", tier:"medium", clue:"A powerful, rotating storm system"},
      {word:"TORNADO", tier:"medium", clue:"A violently spinning column of air"},
      {word:"TWISTER", tier:"medium", clue:"A common name for a tornado"},
      {word:"LIGHTNING", tier:"legendary", clue:"A brilliant flash of electricity during a storm"},
      {word:"BLIZZARD", tier:"legendary", clue:"A severe snowstorm with high winds"},
      {word:"HURRICANE", tier:"legendary", clue:"A powerful rotating storm formed over warm seas"},
      {word:"THUNDERSTORM", tier:"legendary", clue:"A storm bringing thunder, lightning, and heavy rain"},
    ]},
  stars: { label:"Stars & Omens", icon:"🌌", color:"#4a3f7a",
    list:[
      {word:"STAR", tier:"easy", clue:"A glowing point of light in the night sky"},
      {word:"MOON", tier:"easy", clue:"The natural satellite that lights up the night"},
      {word:"SIGN", tier:"easy", clue:"An omen believed to hint at what's to come"},
      {word:"FATE", tier:"easy", clue:"The force believed to predetermine events"},
      {word:"LUCK", tier:"easy", clue:"Good or bad fortune, often unearned"},
      {word:"COMET", tier:"easy", clue:"An icy body that streaks across the sky"},
      {word:"ORBIT", tier:"easy", clue:"The curved path a body follows around another"},
      {word:"VOID", tier:"easy", clue:"The vast emptiness beyond the stars"},
      {word:"GLOW", tier:"easy", clue:"A soft, steady light"},
      {word:"HALO", tier:"easy", clue:"A ring of light around a heavenly body"},
      {word:"ZODIAC", tier:"medium", clue:"The band of constellations tied to birth signs"},
      {word:"ECLIPSE", tier:"medium", clue:"When one heavenly body blocks the light of another"},
      {word:"DESTINY", tier:"medium", clue:"The path believed to be set out for someone"},
      {word:"METEOR", tier:"medium", clue:"A streak of light from a rock burning in the sky"},
      {word:"NEBULA", tier:"medium", clue:"A vast cloud of dust and gas among the stars"},
      {word:"GALAXY", tier:"medium", clue:"A vast system of stars bound together"},
      {word:"COSMOS", tier:"medium", clue:"The universe seen as an ordered, harmonious whole"},
      {word:"PROPHECY", tier:"legendary", clue:"A prediction of what is destined to happen"},
      {word:"CELESTIAL", tier:"legendary", clue:"Relating to the sky or heavens"},
      {word:"ASTROLOGY", tier:"legendary", clue:"The ancient practice of reading fate in the stars"},
      {word:"CONSTELLATION", tier:"legendary", clue:"A named pattern of stars in the night sky"},
    ]},
};

// Puzzle difficulty tiers. Each pulls from the word tiers above and layers on
// decoy letters that don't belong in any answer, so the tile bank isn't just
// "every letter you need" — you have to actually recognize the right ones.
const DIFFICULTY = {
  easy: { key:"easy", label:"Easy", icon:"🌱", words:3, decoysPerWord:0, energyCost:1,
    rewardPerWord:5, masteryBonus:10, tierPools:["easy"],
    desc:"3 short words, no decoy letters. A quick, calm round." },
  medium: { key:"medium", label:"Medium", icon:"⚔️", words:4, decoysPerWord:2, energyCost:1,
    rewardPerWord:6, masteryBonus:14, tierPools:["medium","easy"],
    desc:"4 words with a couple of decoy letters mixed into the tile bank." },
  hard: { key:"hard", label:"Hard", icon:"🔥", words:5, decoysPerWord:3, energyCost:2,
    rewardPerWord:14, masteryBonus:40, tierPools:["medium","legendary"],
    desc:"5 words drawing on tougher vocabulary, with a heavier decoy bank." },
  legendary: { key:"legendary", label:"Legendary", icon:"🐉", words:5, decoysPerWord:4, energyCost:2,
    rewardPerWord:21, masteryBonus:55, tierPools:["legendary","medium"], oncePerDay:true,
    desc:"5 tough words buried in decoy letters. Costs 2 energy, once per day, biggest payout." },
};

// Tribe Plea: reveals the first 2 letters of a fresh (untouched) word. The
// first use each day is free (a small daily goodwill gesture from the
// tribe); uses #2 and #3 cost gold/gems, priced between Golden Axe and
// Streak Freeze since it reveals two letters at once. Capped at 3/day total
// so even a paying player can't buy through an entire hard/legendary puzzle
// (5 words) — consistent with "never a shortcut past actually solving a
// puzzle" elsewhere in the shop.
const TRIBE_PLEA_MAX_PER_DAY = 3;
const TRIBE_PLEA_GOLD_COST = 35;
const TRIBE_PLEA_GEM_COST = 105;

const BUILDING_TYPES = {
  farm:    { name:"Farm",       group:"production", category:"grain",   icon:"🌾", baseCost:20, colors:["#c9a63f","#8fae4a","#c47a3d"] },
  mine:    { name:"Mine",       group:"production", category:"metals",  icon:"⛏️", baseCost:26, colors:["#8a94b8","#b0865b","#6d7a9e"] },
  cottage: { name:"Cottage",    group:"housing",     category:"food",    icon:"🏠", baseCost:22, colors:["#d99a5b","#b6553f","#7a9b6e"] },
  tower:   { name:"Watchtower", group:"landmark",    category:null,      icon:"🗼", baseCost:32, colors:["#8a94b8","#d4a24c","#5a6a9e"] },
  temple:  { name:"Temple",     group:"landmark",    category:"magic",   icon:"⛩️", baseCost:38, colors:["#9b7fc4","#d4a24c","#4f8b7b"] },
  market:  { name:"Market",     group:"community",   category:"animals", icon:"🏪", baseCost:24, colors:["#c1583f","#c9a63f","#4f8b7b"] },
  weaver:  { name:"Weaver's Hut",       group:"production", category:"cloth", icon:"🧵", baseCost:28, colors:["#c77dab","#b8763f","#6d5a8a"] },
  dock:    { name:"Dock",               group:"production", category:"sea",   icon:"⚓", baseCost:30, colors:["#5b9bc4","#4c7a8a","#3d5a7a"] },
  quarry:  { name:"Quarry",             group:"production", category:"stone", icon:"🪨", baseCost:34, colors:["#9c9484","#8a7a5c","#6d6558"] },
  garden:  { name:"Herbalist's Garden", group:"community",  category:"herbs", icon:"🌿", baseCost:26, colors:["#a3a15c","#c9a63f","#4f8b7b"] },
  lodge:   { name:"Ranger's Lodge", group:"production", category:"nature",  icon:"🌲", baseCost:26, colors:["#4a8f7f","#3f7a68","#2f5f52"] },
  barracks:{ name:"Barracks",       group:"production", category:"war",     icon:"⚔️", baseCost:36, colors:["#8f3d35","#6d2f28","#a34d3f"] },
  manor:   { name:"Manor",          group:"landmark",   category:"royalty", icon:"👑", baseCost:40, colors:["#5c4a8f","#4a3d70","#7a63b0"] },
  stage:   { name:"Bard's Stage",   group:"community",  category:"music",   icon:"🎻", baseCost:24, colors:["#3f8fa3","#357689","#4fa8bd"] },
  vane:    { name:"Weathervane",    group:"production", category:"weather", icon:"🌦️", baseCost:20, colors:["#8aa8b8","#7090a0","#a0c0d0"] },
  observatory: { name:"Observatory", group:"landmark",   category:"stars",  icon:"🌌", baseCost:42, colors:["#4a3f7a","#372c5e","#5c4f96"] },
};

// Custom SVG icon for the Tribe tab/panel (replaces the generic "people
// holding hands" emoji, which didn't read as tribal). Simple silhouette:
// feather + head + poncho-shaped body, monochrome via currentColor so it
// follows the tab's active/inactive text color automatically.
const TRIBE_ICON_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M11.3 2.4c.3-.5 1.1-.5 1.4 0l1.1 2-1.8-.4-1.8.4 1.1-2z"/><circle cx="12" cy="8.3" r="2.8"/><path d="M12 11.6c-3.4 0-6.2 2.6-6.6 6l-.3 2.9c-.1.6.4 1.1 1 1.1h11.8c.6 0 1.1-.5 1-1.1l-.3-2.9c-.4-3.4-3.2-6-6.6-6z"/></svg>`;

const TRIBE_DATA = [
  { id:"blacksmith", name:"Brenna Ironhand", role:"Blacksmith", category:"metals", icon:"🔨",
    story:["She barely looks up from the forge when you pass.","Brenna nods at you now — a rare thing for her.","\"Your kingdom's got good steel in it,\" she says, almost smiling.","She shows you a blade etched with your kingdom's sigil, unasked.","\"Whatever you're building next — I'm making the nails for it.\""]},
  { id:"cook", name:"Old Tomas", role:"Cook", category:"food", icon:"🍲",
    story:["He grumbles about the state of the pantry.","Tomas saves you the first taste of the stew now.","He starts calling you \"the reason this kitchen still runs.\"","He teaches you his grandmother's honey-bread recipe.","\"Every feast from here on has your name on the menu.\""]},
  { id:"miller", name:"Miriam", role:"Miller", category:"grain", icon:"🌾",
    story:["She's too busy with the millstone to chat.","Miriam waves the flour dust away to greet you properly.","She tells you which field yields the sweetest wheat.","She names a new grain blend after your kingdom.","\"This mill runs for you now, not just for grain.\""]},
  { id:"shepherd", name:"Finn", role:"Shepherd", category:"animals", icon:"🐑",
    story:["He keeps his eyes on the flock, not on you.","Finn lets you help count the herd this time.","He tells you about the wolf he outran as a boy.","He gifts you a lamb born on your kingdom's founding day.","\"The whole flock knows your step by now.\""]},
  { id:"mystic", name:"Elyra", role:"Mystic", category:"magic", icon:"🔮",
    story:["She studies you like a rune she hasn't translated yet.","Elyra shares a small charm — \"for luck,\" she says.","She teaches you to read one rune correctly.","She shows you a spell tied to your kingdom's founding.","\"You've become part of the working now. I don't say that lightly.\""]},
  { id:"weaver", name:"Yara Loomwright", role:"Weaver", category:"cloth", icon:"🧵",
    story:["She barely glances up from the loom, threads flying between her fingers.","Yara nods when she sees you now, no longer counting your steps.","She tells you the pattern she's weaving is named after your banner.","She stitches your kingdom's sigil into a bolt of fine cloth, unasked.","\"Every thread in this hall runs back to you now.\""]},
  { id:"fisher", name:"Cobb", role:"Fisherman", category:"sea", icon:"🎣",
    story:["He keeps his eyes on the water, barely acknowledging you.","Cobb waves you over to see the morning's catch.","He teaches you to read the tide before it turns.","He names a new fishing spot after your kingdom.","\"The sea's been kind since you started coming around.\""]},
  { id:"mason", name:"Doran Stonehand", role:"Mason", category:"stone", icon:"🪨",
    story:["He grunts and keeps chiseling, not sparing you a look.","Doran lets you carry a stone for him — a rare honor.","He shows you the mark he carves into every finished wall.","He sets a cornerstone bearing your kingdom's name.","\"Every wall I raise now, I raise for you.\""]},
  { id:"healer", name:"Wren", role:"Herbalist", category:"herbs", icon:"🌿",
    story:["She's absorbed in sorting dried leaves, and doesn't look up.","Wren offers you a cup of her own blended tea.","She teaches you which root eases a fever.","She names a new remedy after your kingdom.","\"Half the village's medicine chest is yours to thank now.\""]},
  { id:"ranger", name:"Rowan", role:"Ranger", category:"nature", icon:"🌲",
    story:["He melts into the treeline before you can even wave.","Rowan lets you walk beside him on his rounds now.","He shows you a deer trail only he knows.","He plants a grove and names it after your kingdom.","\"The forest's watched you long enough to trust you too.\""]},
  { id:"captain", name:"Captain Aldric", role:"Captain of the Guard", category:"war", icon:"⚔️",
    story:["He eyes you the way he eyes everyone — like a threat.","Aldric nods you through the gate without a second look now.","He teaches you the proper grip on a training sword.","He names a company of the guard after your kingdom.","\"I'd trust you at my back in any siege.\""]},
  { id:"steward", name:"Lady Isolde", role:"Steward", category:"royalty", icon:"👑",
    story:["She barely spares you a glance over her ledgers.","Isolde greets you by name now, ledger set aside.","She lets you sit in on a council meeting.","She drafts your kingdom into the region's official records.","\"The court speaks of you as one of our own now.\""]},
  { id:"bard", name:"Pip", role:"Bard", category:"music", icon:"🎻",
    story:["He's mid-song and doesn't break rhythm to notice you.","Pip works your name into the chorus, grinning.","He teaches you the opening chords of his favorite ballad.","He composes a whole song about your kingdom's founding.","\"Every tavern from here to the coast sings your name now.\""]},
  { id:"weatherreader", name:"Fenna", role:"Weather-Reader", category:"weather", icon:"🌦️",
    story:["She's watching the clouds and doesn't hear you approach.","Fenna waves you over to read the sky with her.","She teaches you to spot a storm two days out.","She names a coming season's first frost after your kingdom.","\"The sky's never lied to me — and it likes you.\""]},
  { id:"astrologer", name:"Corvin", role:"Astrologer", category:"stars", icon:"🌌",
    story:["He's tracing star charts and doesn't look up.","Corvin shows you the chart he's been keeping on you.","He teaches you to read one constellation correctly.","He names a comet's path after your kingdom's founding night.","\"The stars marked you the night you arrived. I only just noticed.\""]},
];

const SHOP_SKINS = ["Classic","Autumn","Twilight"]; // maps to colors[] index per building

// Regions extend the game past the original 16-plot grid: each unlocked
// region is a fresh 16-plot city using the same building types and word
// categories (so no new content has to be invented per region, avoiding
// half-baked word lists). Gold and everything else (streak, hints, tribe,
// spaced-repetition memory...) stay shared and global across regions —
// only the building grid itself is per-region.
const REGIONS = [
  { id:'home',       name:"Homeland",        icon:"🏰", unlockCost:0 },
  { id:'riverlands', name:"The Riverlands",   icon:"🌊", unlockCost:300 },
  { id:'highlands',  name:"The Highlands",    icon:"⛰️", unlockCost:700 },
  { id:'desert',     name:"The Desert Reach", icon:"🏜️", unlockCost:1400 },
];

/* ============================= STATE ============================= */

let state = null;
let cityExpansionOpen = false; // UI-only, not saved: whether the "Kingdom Expansion" disclosure is open

function freshState(){
  const tribe = {};
  TRIBE_DATA.forEach(m=>{
    tribe[m.id] = { trust:0, request: randomWordFrom(m.category), fulfilledToday:false, storyShown:0, reservedNextRequest:false };
  });
  return {
    day:1,
    gold:60,
    energy:4,
    maxEnergy:4,
    hints:3,
    axes:1,
    streak:0,           // consecutive real-world days the player has opened the game
    lastPlayedDate:null, // toDateString() of the last day the streak was counted
    streakFreezes:1,    // free freezes protect one missed day without breaking the streak
    solvedCategoriesToday:new Set(),
    wordHistory:{}, // category -> Set of recently-used words, so puzzles don't repeat back to back
    wordMemory:{},  // category -> { WORD: {level, due} } spaced-repetition state, see updateWordMemory()
    merchant:null,  // traveling merchant's current offer, see refreshMerchantIfDue()
    legendaryUsedToday:false,
    buildings:Array(16).fill(null), // {type, level} — the ACTIVE region's plots; other regions' grids live in `regions` below
    currentRegionId:'home',
    unlockedRegionIds:['home'],
    regions:{}, // { regionId: {buildings:[...]} } — holds every region's grid EXCEPT the currently active one
    prestigeCount:0, // how many times the player has founded a new dynasty — see crownBonusPercent()
    totalDonated:0,  // lifetime gold given to the Memorial Hall — never resets, even on prestige
    gems:0,          // premium cosmetic currency, bought with real Pi — never earned in-game, never pay-to-win
    starterOfferClaimedWeeks:[], // client mirror of which weekly Starter Offer tiers (0-3, see STARTER_OFFER_* below) have already been claimed — server is authoritative
    accountCreatedAt:Date.now(), // set once per account, used to compute which week of the 4-week Starter Offer to show; server independently derives and enforces its own copy of this for anything that gates a real payment
    patronUntil:null, // ISO date string; null or in the past = not an active patron
    patronTier:null,  // 'basic' or 'plus' — which tier's benefits currently apply; see PATRON_PLUS_* above
    autoHarvest:false,     // one-time purchase: building income auto-collects once per real day
    lastAutoHarvestDate:null,
    boosterPuzzlesLeft:0,  // remaining puzzles with doubled gold reward
    safetyNetUsedToday:false,
    tribePleaCountToday:0, // 0-3; use #1 is free, uses #2-3 cost gold/gems (see pleaBtn handler)
    skins:{}, // buildingType -> owned skin indices array
    equippedSkin:{}, // buildingType -> index
    tribe,
    puzzle:null,
    log:[],
    kingdomName:'Kingdom', // set from the Pi username (first 7 chars) once signed in — see applyKingdomNameFromPi()
    ownedBadges:[],  // ids of purchased cosmetic badges — see BADGES
    equippedBadge:null, // currently-displayed badge id, or null; see badgeTag()
    ownedEffects:[], // ids of purchased puzzle-completion effects — see PUZZLE_EFFECTS
    equippedEffect:null, // active effect id, or null (off); see playPuzzleEffect()
    ownedFrames:[], // ids of purchased badge frames — see BADGE_FRAMES
    equippedFrame:null, // active frame id, or null; only visible when equippedBadge is also set
    ownedAuras:[], // ids of purchased building auras — see BUILDING_AURAS
    equippedAura:null, // active aura id, or null; applies to every occupied plot at once
    ownedSoundPacks:[], // ids of purchased sound packs — see SOUND_PACKS
    equippedSoundPack:'default', // active pack id, or null (explicit silence — a deliberate opt-out, never the default); see playSound(). 'default' is DEFAULT_SOUND_PACK, free and always owned, so the app has sound from the very first launch.
    soundMuted:false, // temporary mute — doesn't affect which pack is equipped
    // In-game follow list: Pi's auth scopes only ever return this player's
    // own identity (username/uid), never their Pi friends or followers, so
    // this is a self-contained social graph built entirely from the
    // Leaderboard rather than pulled from Pi. One-directional and stored
    // only on the follower's own save — no consent step needed since
    // following someone changes nothing on their end, just adds them to a
    // personal shortlist here.
    followedPlayerIds:[],
    // Gift mailbox: gifts other players sent this player, waiting to be
    // applied. Populated server-side by /api/gift/send, consumed by
    // applyPendingGifts() at boot — see server.js's GIFTS section for why
    // it's delivered this way instead of a live write.
    pendingGifts:[],
    // Local log of the last GIFT_HISTORY_LIMIT gifts sent/received, for the
    // "Gift History" panel on the Leaderboard tab. Client-side convenience
    // only — see logGiftHistory().
    giftHistory:[],
  };
}

function randomWordFrom(cat){
  // Requests are always drawn from easy/medium words so any difficulty can fulfill them.
  const arr = WORDS[cat].list.filter(w=>w.tier!=="legendary");
  return arr[Math.floor(Math.random()*arr.length)].word;
}

state = freshState();

/* ============================= HELPERS ============================= */

function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._h);
  toast._h = setTimeout(()=>t.classList.remove('show'), 1900);
}

function fmtGold(n){ return n.toLocaleString(); }

// state.kingdomName comes from the player's Pi username — escape it before
// dropping it into innerHTML, since usernames are external, unvalidated input.
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function trustTitle(v){
  if(v>=100) return "Confidant";
  if(v>=75) return "Ally";
  if(v>=50) return "Friend";
  if(v>=25) return "Acquaintance";
  return "Stranger";
}
function trustTier(v){
  if(v>=100) return 4;
  if(v>=75) return 3;
  if(v>=50) return 2;
  if(v>=25) return 1;
  return 0;
}

function closeModal(){
  document.getElementById('overlay').classList.remove('show', 'center-modal');
}
function openModal(html, opts={}){
  document.getElementById('modalBody').innerHTML = `<div class="modal-handle"></div>${html}`;
  const overlay = document.getElementById('overlay');
  overlay.classList.toggle('center-modal', !!opts.center);
  overlay.classList.add('show');
}
document.getElementById('overlay').addEventListener('click', (e)=>{
  if(e.target.id==='overlay') closeModal();
});

// Generic confirm-before-spending modal. Any action that charges gold,
// gems, or consumes a limited resource (hint/axe/energy/freeze/etc) should
// route through this instead of firing straight from the click handler —
// a single tap should never silently charge or consume something without
// the player explicitly confirming first. onConfirm only runs if the
// player taps the confirm button; Cancel (or tapping outside) does nothing.
// Rendered as a centered dialog (not a bottom sheet) so a purchase/top-up
// confirmation is impossible to miss.
function confirmAction({icon='🪙', title, desc, confirmLabel='Confirm', cancelLabel='Cancel', onConfirm}){
  openModal(`
    <h2>${icon} ${title}</h2>
    <div class="sub">${desc}</div>
    <div class="btn-row">
      <button class="btn ghost block" id="confirmActionCancel">${cancelLabel}</button>
      <button class="btn primary block" id="confirmActionOk">${confirmLabel}</button>
    </div>
  `, {center:true});
  document.getElementById('confirmActionCancel').addEventListener('click', closeModal);
  document.getElementById('confirmActionOk').addEventListener('click', ()=>{
    closeModal();
    onConfirm();
  });
}

/* ============================= RENDER: TOP BAR ============================= */

function renderTopbar(){
  document.getElementById('goldVal').textContent = fmtGold(state.gold);
  document.getElementById('gemsVal').textContent = fmtGold(state.gems||0);
  const crownBadge = document.getElementById('crownBadge');
  const crownPct = crownBonusPercent();
  if(crownPct > 0){
    crownBadge.style.display = '';
    crownBadge.textContent = `👑+${crownPct}%`;
  } else {
    crownBadge.style.display = 'none';
  }
  document.getElementById('streakVal').textContent = state.streak || 0;
  document.getElementById('freezeVal').textContent = state.streakFreezes || 0;
  const pipsWrap = document.getElementById('energyPips');
  pipsWrap.innerHTML='';
  for(let i=0;i<state.maxEnergy;i++){
    const p = document.createElement('div');
    p.className = 'pip' + (i < state.energy ? ' full' : '');
    pipsWrap.appendChild(p);
  }
  const userLabel = document.getElementById('piUserLabel');
  if(userLabel){
    if(piUser){
      userLabel.textContent = (isPatronActive() ? '🎗️ ' : '👤 ') + piUser.username;
      userLabel.classList.add('linked');
      userLabel.style.display = '';
    } else {
      // No nagging "please sign in" copy in the topbar — the Log In screen
      // already handled that before the player ever reached this screen.
      userLabel.textContent = '';
      userLabel.classList.remove('linked');
      userLabel.style.display = 'none';
    }
  }
  // Kingdom name rendered under the username — leaves the row(s) free for
  // equipped badges/frame icons to slot in alongside, without crowding
  // the username itself. The name text truncates with an ellipsis (see
  // .kingdom-name-text) while the badge itself never shrinks or gets cut.
  const kingdomLabel = document.getElementById('kingdomNameLabel');
  if(kingdomLabel){
    if(piUser){
      kingdomLabel.innerHTML = `<span class="kingdom-name-text">${escapeHtml(state.kingdomName)}</span>${badgeTag(state.equippedBadge, state.equippedFrame)}`;
      kingdomLabel.style.display = '';
    } else {
      kingdomLabel.innerHTML = '';
      kingdomLabel.style.display = 'none';
    }
  }
}

/* ============================= TAB SWITCHING ============================= */

// The fixed topbar's rendered height can shift (webfont swap, text wrapping
// when the Pi username shows, notch safe-area-inset-top on rotation, etc.),
// and .app's top padding + the About tab's sticky header both need to match
// it exactly or a gap opens up between the topbar and the sticky header with
// page content visible through it. Keep --topbar-h in sync with reality
// instead of trusting the hardcoded fallback.
function syncTopbarHeight(){
  const bar = document.querySelector('.topbar-fixed');
  if(!bar) return;
  const h = bar.getBoundingClientRect().height;
  if(h>0) document.documentElement.style.setProperty('--topbar-h', h+'px');
}
window.addEventListener('resize', syncTopbarHeight);
window.addEventListener('orientationchange', ()=> setTimeout(syncTopbarHeight, 100));
if(document.fonts && document.fonts.ready){
  document.fonts.ready.then(syncTopbarHeight).catch(()=>{});
}

const TABS = ['city','puzzle','tribe','shop','leaderboard','about'];
function showTab(name){
  TABS.forEach(t=>{
    document.getElementById('tab-'+t).style.display = (t===name) ? '' : 'none';
  });
  document.querySelectorAll('.tabnav button').forEach(b=>{
    b.classList.toggle('active', b.dataset.tab===name);
  });
  renderAll();
}
document.querySelectorAll('.tabnav button').forEach(b=>{
  b.addEventListener('click', ()=>showTab(b.dataset.tab));
});

function renderAll(){
  syncTopbarHeight();
  renderTopbar();
  const active = document.querySelector('.tabnav button.active').dataset.tab;
  if(active==='city') renderCity();
  if(active==='puzzle') renderPuzzleTab();
  if(active==='tribe') renderTribe();
  if(active==='shop') renderShop();
  if(active==='leaderboard') renderLeaderboard();
  if(active==='about') renderAbout();
  if(typeof saveState === 'function') saveState();
}

/* ============================= CITY TAB ============================= */

// The first 12 plots (the original 4x3 grid) are open from day one. The 4 extra
// plots added later unlock gradually as the kingdom grows, one every 3 days
// starting on day 15 — so the city visibly expands with progress instead of
// presenting a bigger empty grid on day 1. This staged unlock is a Homeland-only
// onboarding pace; expansion regions (founded well into the game) open in full.
function unlockDayForPlot(i){
  if(state.currentRegionId !== 'home') return null;
  if(i < 12) return null; // always unlocked
  return 15 + (i - 12) * 3; // 15, 18, 21, 24
}

// Swaps which region's 16-plot grid `state.buildings` points to. The region
// being left is checkpointed into `state.regions` first so nothing is lost.
function switchRegion(regionId){
  if(regionId === state.currentRegionId) return;
  if(!state.unlockedRegionIds.includes(regionId)) return;
  state.regions[state.currentRegionId] = { buildings: state.buildings };
  state.currentRegionId = regionId;
  state.buildings = (state.regions[regionId] && state.regions[regionId].buildings) || Array(16).fill(null);
  renderAll();
}

// Founding a new region costs a flat, disclosed, escalating gold price —
// no randomness, no time pressure. It's pure horizontal expansion: nothing
// about the Homeland is lost or reset, so this never has a "wipe your
// progress" downside the way a prestige reset would.
function unlockRegion(regionId){
  const def = REGIONS.find(r=>r.id===regionId);
  if(!def || state.unlockedRegionIds.includes(regionId)) return;
  if(!isHomelandComplete()) return toast('Finish building on all 16 Homeland plots first');
  if(state.gold < def.unlockCost) return toast('Not enough gold to found this region yet');
  confirmAction({icon:def.icon||'🗺️', title:`Found ${def.name}?`, desc:`Spend 🪙${def.unlockCost} gold to found ${def.name}?`, confirmLabel:`🪙${def.unlockCost} · Found`, onConfirm:()=>{
    state.gold -= def.unlockCost;
    state.unlockedRegionIds.push(regionId);
    state.regions[regionId] = { buildings: Array(16).fill(null) };
    toast(`${def.icon} ${def.name} founded!`);
    switchRegion(regionId);
  }});
}

function buildingCost(type, level){
  const base = BUILDING_TYPES[type].baseCost;
  return Math.round(base * level * 0.85) + (level-1)*6;
}

// Legendary (idx 3) isn't in a building's colors[] array — it's always a
// shared shimmering gold, same everywhere it's shown (city plots, market).
function skinColor(buildingKey, skinIdx){
  return skinIdx===3 ? '#f0c878' : BUILDING_TYPES[buildingKey].colors[skinIdx];
}

// Prestige ("Found a New Dynasty"): a fully optional reset that trades your
// current cities for a small PERMANENT gold-income bonus. Capped so it can't
// snowball into an absurd multiplier, and framed as a fresh-start challenge
// mode, not something the game pushes you toward — there's no other benefit
// to resetting, and nothing here that punishes a player for never doing it.
const CROWN_BONUS_PER_PRESTIGE = 5;   // +5% gold income per past prestige...
const CROWN_BONUS_CAP = 50;           // ...capped at +50% total
function crownBonusPercent(){
  return Math.min(state.prestigeCount * CROWN_BONUS_PER_PRESTIGE, CROWN_BONUS_CAP);
}
// All gold GAINS (not spending) should route through here so the crown
// bonus applies consistently everywhere gold is earned.
function addGold(amount){
  const total = Math.round(amount * (1 + crownBonusPercent()/100));
  state.gold += total;
  return total;
}
function canPrestige(){
  return state.unlockedRegionIds.length >= REGIONS.length; // every region founded at least once
}
function doPrestige(){
  if(!canPrestige()) return;
  const fresh = freshState();
  // Keep: real-world habit progress (streak/freezes), learning progress
  // (spaced-repetition memory, word history), cosmetics already bought, and
  // the prestige count itself. Reset: cities, regions, gold, tribe trust,
  // and today's session flags — the actual "start over" part of prestige.
  fresh.streak = state.streak;
  fresh.lastPlayedDate = state.lastPlayedDate;
  fresh.streakFreezes = state.streakFreezes;
  fresh.wordHistory = state.wordHistory;
  fresh.wordMemory = state.wordMemory;
  fresh.skins = state.skins;
  fresh.equippedSkin = state.equippedSkin;
  fresh.prestigeCount = state.prestigeCount + 1;
  fresh.totalDonated = state.totalDonated; // lifetime legacy stat, not tied to any one dynasty
  fresh.gems = state.gems; // bought with real Pi — a reset never takes away something that was paid for
  fresh.starterOfferClaimedWeeks = state.starterOfferClaimedWeeks; // which weekly tiers are used up stays used up across a reset — no re-claiming via prestige
  fresh.accountCreatedAt = state.accountCreatedAt; // the 4-week window is anchored to the account, not the current dynasty
  fresh.patronUntil = state.patronUntil;
  fresh.patronTier = state.patronTier;
  fresh.autoHarvest = state.autoHarvest; // a permanent purchase — a reset shouldn't undo something already bought
  fresh.kingdomName = state.kingdomName; // your kingdom's name is your identity — a reset doesn't rename it
  fresh.ownedBadges = state.ownedBadges; // purchased cosmetics survive a reset, same as skins
  fresh.equippedBadge = state.equippedBadge;
  fresh.ownedEffects = state.ownedEffects;
  fresh.equippedEffect = state.equippedEffect;
  fresh.ownedFrames = state.ownedFrames;
  fresh.equippedFrame = state.equippedFrame;
  fresh.ownedAuras = state.ownedAuras;
  fresh.equippedAura = state.equippedAura;
  fresh.ownedSoundPacks = state.ownedSoundPacks;
  fresh.equippedSoundPack = state.equippedSoundPack;
  fresh.soundMuted = state.soundMuted;
  fresh.followedPlayerIds = state.followedPlayerIds; // a social list, not part of a dynasty's economy — a reset doesn't unfollow anyone
  fresh.giftHistory = state.giftHistory; // a social log, same reasoning as followedPlayerIds above
  state = fresh;
  toast(`👑 New dynasty founded! Permanent gold bonus: +${crownBonusPercent()}%`);
  if(state.prestigeCount===1) toast(`🏆 Founder Badge unlocked!`);
  renderAll();
}

// Memorial Hall: a gold sink with no gameplay reward at all beyond a purely
// cosmetic badge and a legacy number — deliberately the "cleanest" sink in
// the game. Donations are voluntary, amounts are fixed and disclosed, there's
// no time pressure, and the lifetime total survives prestige resets since
// it's meant to track your kingdom's whole history, not one playthrough.
const MEMORIALS = [
  { threshold:100,   name:"Founder's Stone",  icon:"🪨" },
  { threshold:500,   name:"Bronze Statue",     icon:"🗿" },
  { threshold:1500,  name:"Marble Obelisk",    icon:"🏛️" },
  { threshold:5000,  name:"Grand Fountain",    icon:"⛲" },
  { threshold:15000, name:"Eternal Spire",     icon:"🗼" },
];
const DONATION_AMOUNTS = [25, 100, 500];

function donateGold(amount){
  if(amount<=0) return;
  if(state.gold < amount) return toast('Not enough gold');
  confirmAction({icon:'🏛️', title:'Donate to Memorial Hall', desc:`Donate 🪙${amount} gold to the Memorial Hall?`, confirmLabel:`🪙${amount} · Donate`, onConfirm:()=>{
    state.gold -= amount;
    const before = state.totalDonated;
    state.totalDonated += amount;
    const newlyUnlocked = MEMORIALS.filter(m=> before < m.threshold && state.totalDonated >= m.threshold);
    if(newlyUnlocked.length){
      const m = newlyUnlocked[newlyUnlocked.length-1];
      toast(`${m.icon} ${m.name} unlocked! Donated 🪙${amount} to the Memorial Hall.`);
    } else {
      toast(`Donated 🪙${amount} to the Memorial Hall.`);
    }
    renderAll();
  }});
}

function openPrestigeConfirm(){
  if(!canPrestige()) return;
  const nextPct = Math.min((state.prestigeCount+1)*CROWN_BONUS_PER_PRESTIGE, CROWN_BONUS_CAP);
  openModal(`
    <h2>👑 Found a New Dynasty?</h2>
    <div class="sub">This resets your cities, regions, and gold back to the start, and clears tribe trust. It permanently raises your gold income to +${nextPct}%. Your streak, spaced-repetition progress, and owned cosmetics are kept.</div>
    <div class="fair-note">Entirely optional — there's no other benefit to doing this, and no downside to never doing it.</div>
    <div class="btn-row">
      <button class="btn ghost block" id="cancelPrestige">Not yet</button>
      <button class="btn primary block" id="confirmPrestige">Reset &amp; Ascend</button>
    </div>
  `);
  document.getElementById('cancelPrestige').addEventListener('click', closeModal);
  document.getElementById('confirmPrestige').addEventListener('click', ()=>{
    closeModal();
    doPrestige();
  });
}

function gridForRegion(regionId){
  if(regionId === state.currentRegionId) return state.buildings;
  return (state.regions[regionId] && state.regions[regionId].buildings) || Array(16).fill(null);
}
function isHomelandComplete(){
  return gridForRegion('home').every(b=>b!==null);
}

function renderCity(){
  const wrap = document.getElementById('tab-city');
  let plotsHtml = '';
  state.buildings.forEach((b, i)=>{
    const unlockDay = unlockDayForPlot(i);
    const isLocked = unlockDay!==null && state.day < unlockDay;
    if(isLocked){
      plotsHtml += `<div class="plot locked">
        <span class="bicon">🔒</span>
        <span class="lockday">Day ${unlockDay}</span>
      </div>`;
    } else if(!b){
      plotsHtml += `<button class="plot empty" data-plot="${i}">+</button>`;
    } else {
      const def = BUILDING_TYPES[b.type];
      const skinIdx = state.equippedSkin[b.type] || 0;
      const color = skinColor(b.type, skinIdx);
      const legendaryClass = skinIdx===3 ? ' legendary' : '';
      const aura = state.equippedAura ? findAura(state.equippedAura) : null;
      const auraClass = aura ? ' has-aura' : '';
      const auraStyle = aura ? ` --aura-color:${aura.color};` : '';
      plotsHtml += `<button class="plot${legendaryClass}${auraClass}" data-plot="${i}" style="border-color:${color}55; background:linear-gradient(160deg, ${color}22, var(--bg-panel-2));${auraStyle}">
        <span class="bicon">${def.icon}</span>
        <span class="bname">${def.name}</span>
        <span class="blevel">Lv${b.level}</span>
      </button>`;
    }
  });

  const merchant = state.merchant;
  let merchantHtml = '';
  if(merchant){
    const def = BUILDING_TYPES[merchant.buildingKey];
    const color = def.colors[merchant.skinIdx];
    const affordable = state.gold >= merchant.price;
    merchantHtml = `
    <div class="panel">
      <h2 class="panel-title">🧳 Traveling Merchant</h2>
      <p class="panel-sub">Visiting until Day ${merchant.availableUntilDay}. Cosmetic only — same fair-play promise as the shop.</p>
      <div class="shop-item">
        <div class="shop-icon" style="background:${color}33; border-radius:8px;">${def.icon}</div>
        <div class="shop-info">
          <div class="shop-name">${SHOP_SKINS[merchant.skinIdx]} ${def.name} skin</div>
          <div class="shop-desc">A discounted skin, only while the merchant's in town.</div>
        </div>
        <button class="btn shop-buy primary" id="buyMerchant" ${affordable?'':'disabled'}>🪙${merchant.price}</button>
      </div>
    </div>`;
  }

  // Kingdom Stats: entirely free — this data (distinct words solved per
  // category, days played) already lives in the save for other reasons
  // (spaced repetition, day counter), so there's no real cost to showing it.
  // Deliberately reads state.wordMemory, not state.wordHistory — wordHistory
  // is a rotating "recently used" set that gets cleared once a category's
  // pool is exhausted (see pickPuzzleWords), so its size would understate
  // and fluctuate. wordMemory keeps one permanent record per word ever
  // solved (created in updateWordMemory, never deleted), so its key count
  // is the real per-category total.
  const categoryStatRows = Object.keys(WORDS).map(catKey=>{
    const cat = WORDS[catKey];
    const solvedCount = Object.keys(state.wordMemory[catKey] || {}).length;
    return `<div class="stat-row"><span>${cat.icon} ${cat.label}</span><span>${solvedCount} word${solvedCount===1?'':'s'}</span></div>`;
  }).join('');
  const totalWordsSolved = Object.values(state.wordMemory).reduce((sum,cat)=>sum+Object.keys(cat).length, 0);
  const statsHtml = `
    <div class="panel" style="margin-bottom:0;">
      <div class="stat-row"><span>📅 Days played</span><span>${state.day}</span></div>
      <div class="stat-row"><span>📖 Total words learned</span><span>${totalWordsSolved}</span></div>
      <h3 style="color:var(--gold-bright); font-size:13.5px; margin:14px 0 6px;">Words learned by category</h3>
      ${categoryStatRows}
    </div>`;

  let regionTabsHtml = REGIONS.map(r=>{
    const unlocked = state.unlockedRegionIds.includes(r.id);
    const active = r.id === state.currentRegionId;
    if(unlocked){
      return `<button class="region-tab ${active?'active':''}" data-region="${r.id}">${r.icon} ${r.name}</button>`;
    }
    const affordable = state.gold >= r.unlockCost;
    return `<button class="region-tab locked" data-found="${r.id}" ${affordable?'':'disabled'}>${r.icon} ${r.name} — 🪙${r.unlockCost} to found</button>`;
  }).join('');
  const regionHtml = isHomelandComplete() ? `
    <div class="panel">
      <h2 class="panel-title">🗺️ Regions</h2>
      <p class="panel-sub">Found new regions to keep expanding your kingdom — nothing about your current region is lost or reset.</p>
      <div class="region-tabs">${regionTabsHtml}</div>
    </div>` : `
    <div class="panel">
      <h2 class="panel-title">🗺️ Regions</h2>
      <p class="panel-sub">🔒 Build on all 16 Homeland plots to unlock founding new regions.</p>
    </div>`;

  const crownPct = crownBonusPercent();
  let prestigeHtml = '';
  if(canPrestige()){
    prestigeHtml = `
    <div class="panel">
      <h2 class="panel-title">👑 Found a New Dynasty</h2>
      <p class="panel-sub">Optional. Resets your cities, regions, gold, and tribe trust — but grants a permanent gold bonus that never resets. Your streak, hints-earning skills, and cosmetics are untouched.</p>
      <div class="shop-item">
        <div class="shop-icon">👑</div>
        <div class="shop-info">
          <div class="shop-name">Dynasty ${state.prestigeCount + 1}</div>
          <div class="shop-desc">Current bonus: +${crownPct}% gold. Next dynasty: +${Math.min((state.prestigeCount+1)*CROWN_BONUS_PER_PRESTIGE, CROWN_BONUS_CAP)}% gold${crownPct>=CROWN_BONUS_CAP?' (already at cap)':''}.</div>
        </div>
        <button class="btn shop-buy" id="doPrestigeBtn">Reset &amp; Ascend</button>
      </div>
    </div>`;
  } else {
    const remaining = REGIONS.length - state.unlockedRegionIds.length;
    prestigeHtml = `
    <div class="panel">
      <h2 class="panel-title">👑 Found a New Dynasty</h2>
      <p class="panel-sub">Found ${remaining} more region${remaining===1?'':'s'} to unlock this optional reset-for-a-permanent-bonus mode.</p>
    </div>`;
  }

  const nextMemorial = MEMORIALS.find(m=> state.totalDonated < m.threshold);
  const memorialGrid = MEMORIALS.map(m=>{
    const unlocked = state.totalDonated >= m.threshold;
    return `<div class="memorial ${unlocked?'unlocked':''}" title="${m.name} — 🪙${m.threshold} lifetime">
      <span class="micon">${unlocked ? m.icon : '❔'}</span>
      <span class="mname">${unlocked ? m.name : '🪙'+m.threshold}</span>
    </div>`;
  }).join('');
  const donateBtns = DONATION_AMOUNTS.map(a=>
    `<button class="btn ghost" data-donate="${a}" ${state.gold<a?'disabled':''}>Donate 🪙${a}</button>`
  ).join('');
  const memorialHtml = `
    <div class="panel">
      <h2 class="panel-title">🏛️ Memorial Hall</h2>
      <p class="panel-sub">Donate gold with no gameplay return — purely a lasting record of your kingdom's history. Lifetime total: 🪙${fmtGold(state.totalDonated)}${nextMemorial ? ` · next monument at 🪙${fmtGold(nextMemorial.threshold)}` : ' · every monument unlocked'}.</p>
      <div class="memorial-grid">${memorialGrid}</div>
      <div class="btn-row" style="margin-top:12px;">${donateBtns}</div>
    </div>`;

  wrap.innerHTML = `
    <div class="panel">
      <h2 class="panel-title">🏰 ${escapeHtml(state.kingdomName)}${badgeTag(state.equippedBadge, state.equippedFrame)}</h2>
      <div class="region-subline">${REGIONS.find(r=>r.id===state.currentRegionId).name}</div>
      <p class="panel-sub">Tap an empty plot to build, or an existing one to upgrade. Building materials come from the words you solve.</p>
      <div class="city-grid">${plotsHtml}</div>
      ${state.buildings.some((b,i)=>unlockDayForPlot(i)!==null && state.day<unlockDayForPlot(i)) ? `<p class="panel-sub" style="margin-top:10px; margin-bottom:0;">🔒 Locked plots unlock as your kingdom grows — check back on the day shown.</p>` : ''}
      <div class="legend">
        <span><span class="swatch" style="background:#c9a63f"></span>Production</span>
        <span><span class="swatch" style="background:#d99a5b"></span>Housing</span>
        <span><span class="swatch" style="background:#8a94b8"></span>Landmark</span>
        <span><span class="swatch" style="background:#c1583f"></span>Community</span>
      </div>
    </div>
    <details class="expansion-panel" id="expansionPanel" ${cityExpansionOpen?'open':''}>
      <summary class="panel-title expansion-summary">🏰 Kingdom Expansion <span class="exp-hint">Regions · Dynasty · Memorial Hall · Merchant</span></summary>
      ${regionHtml}
      ${prestigeHtml}
      ${memorialHtml}
      ${merchantHtml}
    </details>
    <details class="expansion-panel" id="statsPanel">
      <summary class="panel-title expansion-summary">📊 Kingdom Stats <span class="exp-hint">Words learned · Days played</span></summary>
      ${statsHtml}
    </details>
    <div class="panel">
      <h2 class="panel-title">🌙 End the Day</h2>
      <p class="panel-sub">Collect income from your production buildings, restore your energy fully, and refresh the tribe's requests. Stepping away never costs you anything.</p>
      <button class="btn primary block" id="nextDayBtn">Rest until tomorrow — Day ${state.day} → ${state.day+1}</button>
    </div>
  `;

  wrap.querySelectorAll('.plot[data-plot]').forEach(el=>{
    el.addEventListener('click', ()=>{
      const i = parseInt(el.dataset.plot);
      if(state.buildings[i]) openUpgradeModal(i); else openBuildModal(i);
    });
  });
  document.getElementById('nextDayBtn').addEventListener('click', nextDay);
  const expansionPanel = document.getElementById('expansionPanel');
  if(expansionPanel) expansionPanel.addEventListener('toggle', ()=>{ cityExpansionOpen = expansionPanel.open; });
  wrap.querySelectorAll('[data-region]').forEach(el=>{
    el.addEventListener('click', ()=> switchRegion(el.dataset.region));
  });
  wrap.querySelectorAll('[data-found]').forEach(el=>{
    el.addEventListener('click', ()=> unlockRegion(el.dataset.found));
  });
  const prestigeBtn = document.getElementById('doPrestigeBtn');
  if(prestigeBtn) prestigeBtn.addEventListener('click', openPrestigeConfirm);
  wrap.querySelectorAll('[data-donate]').forEach(el=>{
    el.addEventListener('click', ()=> donateGold(parseInt(el.dataset.donate)));
  });
  const buyMerchantBtn = document.getElementById('buyMerchant');
  if(buyMerchantBtn) buyMerchantBtn.addEventListener('click', ()=>{
    if(!state.merchant) return;
    if(state.gold < state.merchant.price) return toast('Not enough gold');
    const {buildingKey, skinIdx, price} = state.merchant;
    confirmAction({icon:'🛒', title:'Buy from Merchant', desc:`Spend 🪙${price} gold on this ${BUILDING_TYPES[buildingKey].name} skin? The merchant only offers one purchase per visit.`, confirmLabel:`🪙${price} · Buy`, onConfirm: async ()=>{
      const ok = await buyCosmetic({ kind:'skin', skinVariant:'merchant', buildingKey, skinIdx });
      if(ok){
        toast(`${SHOP_SKINS[skinIdx]} ${BUILDING_TYPES[buildingKey].name} skin unlocked!`);
        state.merchant = null; // one purchase per visit — the merchant returns again in a few days
        renderAll();
      }
    }});
  });
}

function openBuildModal(plotIndex){
  let opts = '';
  Object.entries(BUILDING_TYPES).forEach(([key,def])=>{
    const cost = buildingCost(key,1);
    const affordable = state.gold >= cost;
    opts += `<button class="opt" data-build="${key}" ${affordable?'':'disabled'}>
      <span class="oicon">${def.icon}</span>
      <span class="oinfo">
        <span class="oname">${def.name}</span>
        <span class="osub">${groupLabel(def.group)}${def.category? ' · needs '+WORDS[def.category].label+' words to upgrade':''}</span>
      </span>
      <span class="ocost">🪙${cost}</span>
    </button>`;
  });
  openModal(`
    <h2>Build on this plot</h2>
    <div class="sub">Choose what to raise here. You can change its look later in the Shop.</div>
    <div class="opt-list">${opts}</div>
  `);
  document.querySelectorAll('[data-build]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const key = b.dataset.build;
      const cost = buildingCost(key,1);
      if(state.gold < cost) return;
      state.gold -= cost;
      state.buildings[plotIndex] = {type:key, level:1};
      closeModal();
      toast(`${BUILDING_TYPES[key].name} built!`);
      renderAll();
    });
  });
}

function groupLabel(g){
  return {production:"Production", housing:"Housing", landmark:"Landmark · cosmetic", community:"Community"}[g];
}

function openUpgradeModal(plotIndex){
  const b = state.buildings[plotIndex];
  const def = BUILDING_TYPES[b.type];
  const maxLevel = 5;
  if(b.level >= maxLevel){
    openModal(`
      <h2>${def.icon} ${def.name} — Level ${b.level}</h2>
      <div class="sub">This building has reached its finest form.</div>
      <div class="fair-note">Fully grown. Nothing left to buy here — just enjoy the view.</div>
      <div class="btn-row"><button class="btn block ghost" id="closeM">Close</button></div>
    `);
    document.getElementById('closeM').addEventListener('click', closeModal);
    return;
  }
  const nextLevel = b.level+1;
  const cost = buildingCost(b.type, nextLevel);
  const needsKeyword = nextLevel>=3 && def.category;
  const keywordMet = !needsKeyword || state.solvedCategoriesToday.has(def.category);
  const affordable = state.gold >= cost;
  const canUpgrade = affordable && keywordMet;

  openModal(`
    <h2>${def.icon} ${def.name} — Level ${b.level}</h2>
    <div class="sub">${groupLabel(def.group)}${def.category? ' · tied to '+WORDS[def.category].label:''}</div>
    <div class="opt" style="align-items:flex-start;">
      <span class="oicon">⬆️</span>
      <span class="oinfo">
        <span class="oname">Upgrade to Level ${nextLevel}</span>
        <span class="osub">${needsKeyword ? `Requires solving a ${WORDS[def.category].label} word today: ${keywordMet? '✅ done':'❌ not yet'}` : 'No word requirement for this level'}</span>
      </span>
      <span class="ocost">🪙${cost}</span>
    </div>
    <div class="btn-row">
      <button class="btn primary block" id="doUpgrade" ${canUpgrade?'':'disabled'}>Upgrade</button>
    </div>
    ${!keywordMet? `<div class="fair-note">Go solve a ${WORDS[def.category].label} puzzle today, then come back to finish this upgrade.</div>` : ''}
  `);
  const btn = document.getElementById('doUpgrade');
  if(btn) btn.addEventListener('click', ()=>{
    if(!canUpgrade) return;
    state.gold -= cost;
    b.level = nextLevel;
    closeModal();
    toast(`${def.name} upgraded to level ${nextLevel}!`);
    renderAll();
  });
}

/* Daily streak: counted once per REAL calendar day the player opens the app
   (not per in-game "day", since a player can click nextDay() many times in
   one sitting). A small flat gold reward each day, plus a modest fixed
   milestone bonus every 5 days — no multiplier, so it can't snowball into
   an ever-larger daily payout that punishes players for ever missing one.

   Streak Freeze: if the player misses exactly one calendar day and holds
   at least one freeze, it's consumed automatically and the streak survives
   instead of resetting — mirrors Duolingo's streak freeze. Missing two or
   more days in a row still breaks the streak regardless of freezes held,
   so it protects against one bad day, not indefinite absence. */
function daysSinceDateString(dateStr){
  if(!dateStr) return null;
  const past = new Date(new Date(dateStr).toDateString());
  const today = new Date(new Date().toDateString());
  return Math.round((today - past) / 86400000);
}

function applyDailyStreak(){
  const today = new Date().toDateString();
  if(state.lastPlayedDate === today) return; // already counted today

  const gap = daysSinceDateString(state.lastPlayedDate); // null = first-ever visit
  let usedFreeze = false;

  if(gap === 1){
    state.streak += 1;
  } else if(gap === 2 && state.streakFreezes > 0){
    state.streakFreezes -= 1;
    state.streak += 1;
    usedFreeze = true;
  } else {
    state.streak = 1; // first visit, or the gap was too large for a freeze to cover
  }
  state.lastPlayedDate = today;

  let bonus = 5;
  let msg = usedFreeze
    ? `🧊 Streak freeze used — your ${state.streak}-day streak is safe! +🪙${bonus}`
    : `📅 Day ${state.streak} streak! +🪙${bonus}`;
  if(state.streak % 5 === 0){
    bonus += 20; // fixed milestone top-up, not a multiplier
    msg = usedFreeze
      ? `🧊 Freeze used, and you hit a ${state.streak}-day milestone! +🪙${bonus}`
      : `🔥 ${state.streak}-day streak milestone! +🪙${bonus}`;
  }
  addGold(bonus);
  toast(msg);
}

// Auto-Harvest (one-time purchase): collects building income once per real
// calendar day automatically, independent of the manual "Rest until
// tomorrow" button — which still exists and still handles energy, tribe
// requests, and advancing the in-game day. This only automates the passive
// gold part, so the reasons to actually open the app (streak, puzzles,
// tribe, spaced-repetition reviews) are untouched.
function applyAutoHarvest(){
  if(!state.autoHarvest) return;
  const today = new Date().toDateString();
  if(state.lastAutoHarvestDate === today) return;
  state.lastAutoHarvestDate = today;
  let income = 0;
  const allGrids = [state.buildings, ...Object.values(state.regions).map(r=>r.buildings)];
  allGrids.forEach(grid=>{
    grid.forEach(b=>{
      if(b && BUILDING_TYPES[b.type].group==='production') income += b.level*4;
    });
  });
  if(income>0){
    addGold(income);
    toast(`⚙️ Auto-Harvest collected 🪙${income} while you were away.`);
  }
}

function nextDay(){
  // collect passive income from every unlocked region's production buildings,
  // not just the one currently in view — switching regions shouldn't mean
  // the other one's economy silently stops.
  let income = 0;
  const allGrids = [state.buildings, ...Object.values(state.regions).map(r=>r.buildings)];
  allGrids.forEach(grid=>{
    grid.forEach(b=>{
      if(b && BUILDING_TYPES[b.type].group==='production') income += b.level*4;
    });
  });
  addGold(income);
  state.day += 1;
  state.energy = state.maxEnergy;
  state.solvedCategoriesToday = new Set();
  state.legendaryUsedToday = false;
  state.safetyNetUsedToday = false;
  state.tribePleaCountToday = 0;
  Object.keys(state.tribe).forEach(id=>{
    const cat = TRIBE_DATA.find(m=>m.id===id).category;
    state.tribe[id].fulfilledToday = false;
    if(state.tribe[id].reservedNextRequest){
      // Reserved — keep asking for the same word instead of re-rolling.
      state.tribe[id].reservedNextRequest = false;
    } else {
      state.tribe[id].request = randomWordFrom(cat);
    }
  });
  refreshMerchantIfDue();
  if(isPatronActive()){
    const trickle = isPatronPlusActive() ? 5 : 2;
    state.gems = (state.gems||0) + trickle;
    toast(income>0 ? `New day! Collected 🪙${income} from your buildings + 💎${trickle} patron trickle.` : `A new day begins — energy fully restored. +💎${trickle} patron trickle.`);
  } else {
    toast(income>0 ? `New day! Collected 🪙${income} from your buildings.` : `A new day begins — energy fully restored.`);
  }
  renderAll();
}

/* Traveling Merchant — a gold sink, not a pressure tactic:
   - Appears roughly every 3 in-game days, selling one cosmetic skin at a
     modest fixed discount off the shop's normal price.
   - The visit window is several in-game days wide, and shown as a plain
     "until Day X" label — no countdown clock, no "last chance" copy, no
     randomized rarity. The same catalog of skins keeps rotating through
     over time, so missing one visit isn't a permanently lost opportunity.
   - Purely cosmetic goods only, same as the rest of the skin shop — never
     gates a competitive advantage behind the visit. */
function refreshMerchantIfDue(){
  if(state.merchant && state.day > state.merchant.availableUntilDay){
    state.merchant = null;
  }
  if(!state.merchant && state.day % 3 === 0){
    const candidates = [];
    Object.keys(BUILDING_TYPES).forEach(key=>{
      const owned = state.skins[key] || [0];
      [1,2].forEach(idx=>{ if(!owned.includes(idx)) candidates.push({buildingKey:key, skinIdx:idx}); });
    });
    if(candidates.length>0){
      const pick = candidates[Math.floor(Math.random()*candidates.length)];
      state.merchant = {
        buildingKey: pick.buildingKey,
        skinIdx: pick.skinIdx,
        price: 15, // a modest discount off the shop's normal 20-gold skin price
        availableUntilDay: state.day + 3,
      };
      const def = BUILDING_TYPES[pick.buildingKey];
      toast(`🧳 A traveling merchant is visiting until Day ${state.merchant.availableUntilDay} — selling a ${SHOP_SKINS[pick.skinIdx]} ${def.name} skin.`);
    }
  }
}

/* ============================= PUZZLE TAB ============================= */

function renderPuzzleTab(){
  const wrap = document.getElementById('tab-puzzle');
  if(state.puzzle){ renderPuzzlePlay(); return; }

  let cards = '';
  Object.entries(WORDS).forEach(([key, def])=>{
    const requestingMembers = TRIBE_DATA.filter(m=>m.category===key && !state.tribe[m.id].fulfilledToday);
    const isRequest = requestingMembers.length>0;
    const disabled = state.energy<=0;
    cards += `<button class="cat-card${isRequest?' request':''}" data-cat="${key}" ${disabled?'disabled':''}>
      <span class="cicon">${def.icon}</span>
      <span class="cinfo">
        <span class="cname">${def.label}${isRequest? ` <span class="req-badge">⭐ ${requestingMembers[0].name.split(' ')[0]} needs a word</span>`:''}</span>
        <span class="csub">${WORDS[key].list.length} words in this category · pick a difficulty</span>
      </span>
      <span class="ccost">›</span>
    </button>`;
  });

  wrap.innerHTML = `
    <div class="panel">
      <h2 class="panel-title">📜 Choose a Word Puzzle</h2>
      <p class="panel-sub">Solve clued words to earn gold. Matching a tribe member's request gives a bonus. No penalty for a wrong guess — just try again.</p>
      <div class="cat-list">${cards}</div>
      ${state.energy<=0 ? `<div class="fair-note" style="margin-top:12px;">Out of energy for today — that's fine. Rest in the City tab and come back with a full supply, free of charge.</div>` : ''}
    </div>
  `;
  wrap.querySelectorAll('[data-cat]').forEach(el=>{
    el.addEventListener('click', ()=> openDifficultyModal(el.dataset.cat));
  });
}

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function openDifficultyModal(catKey){
  const catDef = WORDS[catKey];
  let opts = '';
  Object.values(DIFFICULTY).forEach(diff=>{
    const lockedByEnergy = state.energy < diff.energyCost;
    const lockedByDaily = diff.oncePerDay && state.legendaryUsedToday;
    const locked = lockedByEnergy || lockedByDaily;
    opts += `<button class="opt" data-diff="${diff.key}" ${locked?'disabled':''}>
      <span class="oicon">${diff.icon}</span>
      <span class="oinfo">
        <span class="oname">${diff.label}${diff.oncePerDay? ' (once/day)':''}</span>
        <span class="osub">${diff.desc}${lockedByDaily? ' — already used today.':''}</span>
      </span>
      <span class="ocost">⚡${diff.energyCost}</span>
    </button>`;
  });
  openModal(`
    <h2>${catDef.icon} ${catDef.label} Puzzle</h2>
    <div class="sub">Pick a difficulty. Higher tiers mix in decoy letters that don't belong in any word.</div>
    <div class="opt-list">${opts}</div>
  `);
  document.querySelectorAll('[data-diff]').forEach(b=>{
    b.addEventListener('click', ()=>{
      const diffKey = b.dataset.diff;
      closeModal();
      startPuzzle(catKey, diffKey);
    });
  });
}

function pickPuzzleWords(catKey, diffKey){
  const diff = DIFFICULTY[diffKey];
  const catWords = WORDS[catKey].list;
  if(!state.wordHistory[catKey]) state.wordHistory[catKey] = new Set();
  if(!state.wordMemory[catKey]) state.wordMemory[catKey] = {};
  const hist = state.wordHistory[catKey];
  const mem = state.wordMemory[catKey];
  const todayMs = new Date(new Date().toDateString()).getTime();

  // Spaced repetition: words the player got wrong or needed a hint/axe for
  // come due for review after a short delay, and get first pick over fresh
  // words — so struggled-with words resurface instead of just cycling
  // through the same random rotation as everything else.
  const dueWords = catWords.filter(w=>{
    const m = mem[w.word];
    return m && m.due && new Date(m.due).getTime() <= todayMs;
  });
  let picked = shuffle(dueWords).slice(0, diff.words);
  picked.forEach(w=>hist.add(w.word));

  diff.tierPools.forEach(tier=>{
    if(picked.length >= diff.words) return;
    const pool = catWords.filter(w=>w.tier===tier && !picked.some(p=>p.word===w.word));
    let unseen = pool.filter(w=>!hist.has(w.word));
    if(unseen.length===0 && pool.length>0){
      // this tier's pool has been fully used recently — free it up so words can resurface
      pool.forEach(w=>hist.delete(w.word));
      unseen = pool.filter(w=>!picked.some(p=>p.word===w.word));
    }
    const need = diff.words - picked.length;
    picked = picked.concat(shuffle(unseen).slice(0, need));
  });
  if(picked.length < diff.words){
    const rest = catWords.filter(w=>!picked.some(p=>p.word===w.word));
    picked = picked.concat(shuffle(rest).slice(0, diff.words-picked.length));
  }
  picked.forEach(w=>hist.add(w.word));
  return shuffle(picked).slice(0, diff.words);
}

// Review intervals in days, indexed by "memory level" — a very small stand-in
// for Duolingo's Half-Life Regression model. Solving a word flawlessly moves
// it up a level (reviewed further out); needing a hint, an axe, or making a
// wrong guess moves it back down (reviewed sooner). Not a real forgetting-
// curve model — no per-user learning-rate estimation — just a Leitner-style
// schedule, which is the well-established simpler cousin of the same idea.
const REVIEW_INTERVALS_DAYS = [1, 3, 7, 16, 30];
function updateWordMemory(catKey, word, flawless){
  if(!state.wordMemory[catKey]) state.wordMemory[catKey] = {};
  const mem = state.wordMemory[catKey];
  const rec = mem[word] || { level:0, due:null };
  rec.level = flawless
    ? Math.min(rec.level+1, REVIEW_INTERVALS_DAYS.length-1)
    : 0; // any struggle resets to the shortest interval, not just one step back
  const days = REVIEW_INTERVALS_DAYS[rec.level];
  rec.due = new Date(Date.now() + days*86400000).toDateString();
  mem[word] = rec;
  checkAchievementBadges();
}

function pickDecoyLetters(word, count){
  if(count<=0) return [];
  const used = new Set(word.split(''));
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(c=>!used.has(c));
  return shuffle(alphabet).slice(0, count);
}

function startPuzzle(catKey, diffKey){
  const diff = DIFFICULTY[diffKey];
  if(state.energy < diff.energyCost) return;
  if(diff.oncePerDay && state.legendaryUsedToday) return;
  state.energy -= diff.energyCost;
  if(diff.oncePerDay) state.legendaryUsedToday = true;

  const source = pickPuzzleWords(catKey, diffKey);
  const words = source.map((w,idx)=>{
    let letters = w.word.split('').map((ch,li)=>({id:`${idx}-c-${li}`, letter:ch, used:false, decoy:false}));
    const decoys = pickDecoyLetters(w.word, diff.decoysPerWord).map((ch,di)=>({id:`${idx}-d-${di}`, letter:ch, used:false, decoy:true}));
    const tiles = shuffle(letters.concat(decoys));
    return {
      word:w.word,
      clue:w.clue,
      tiles,
      blanks: w.word.split('').map(()=>null), // holds tile id
      solved:false,
      flawless:true,
    };
  });
  state.puzzle = {
    category:catKey,
    difficulty:diffKey,
    words,
    current:0,
    goldEarned:0,
    fullyFlawless:true,
    startedAt:Date.now(), // silent — no visible timer/countdown during play, only checked at finish (see finishPuzzle)
  };
  renderAll();
}

function isRequestWord(catKey, word){
  return TRIBE_DATA.filter(m=>m.category===catKey).some(m=> state.tribe[m.id].request===word && !state.tribe[m.id].fulfilledToday);
}

function renderPuzzlePlay(){
  const wrap = document.getElementById('tab-puzzle');
  const p = state.puzzle;
  const catDef = WORDS[p.category];
  const diff = DIFFICULTY[p.difficulty];

  let rowsHtml = '';
  p.words.forEach((w, wi)=>{
    const isActive = wi===p.current && !w.solved;
    const isDone = w.solved;
    const reqWord = isRequestWord(p.category, w.word);
    const memRec = state.wordMemory[p.category] && state.wordMemory[p.category][w.word];
    const isReview = !!memRec;
    const blanksHtml = w.blanks.map((tileId, bi)=>{
      let letter = '';
      if(tileId!==null){
        const tile = w.tiles.find(t=>t.id===tileId);
        letter = tile ? tile.letter : '';
      }
      const filledClass = tileId!==null ? ' filled' : '';
      return `<div class="blank${filledClass}" data-word="${wi}" data-blank="${bi}">${letter}</div>`;
    }).join('');

    rowsHtml += `<div class="word-row ${isActive?'active':''} ${isDone?'done':''}" id="row-${wi}">
      <div class="word-clue"><span>${wi+1}. ${isDone? w.word : w.clue}</span>${reqWord?`<span class="req-tag">⭐ Requested</span>`:''}${(!reqWord && isReview)?`<span class="review-tag" title="Review words pay minimal gold">🔁 Review · 5% 🪙</span>`:''}</div>
      <div class="blanks">${blanksHtml}</div>
    </div>`;
  });

  const activeWord = p.words[p.current];
  let bankHtml = '';
  if(activeWord && !activeWord.solved){
    const anyDecoysLeft = activeWord.tiles.some(t=>t.decoy && !t.used);
    const pleaCount = state.tribePleaCountToday || 0;
    const pleaIsFree = pleaCount === 0;
    const pleaFreshWord = activeWord.blanks.every(b=>b===null);
    const pleaMaxedOut = pleaCount >= TRIBE_PLEA_MAX_PER_DAY;
    const pleaAvailable = !pleaMaxedOut && pleaFreshWord;
    let pleaLabel;
    if(pleaMaxedOut) pleaLabel = '📣 Tribe Plea (used today)';
    else if(pleaIsFree) pleaLabel = '📣 Tribe Plea (free)';
    else pleaLabel = `📣 Tribe Plea 🪙${TRIBE_PLEA_GOLD_COST}`;
    bankHtml = `<div class="tile-bank" id="tileBank">${activeWord.tiles.map(t=>
      `<button class="tile ${t.used?'used':''}" data-tile="${t.id}">${t.letter}</button>`
    ).join('')}</div>
    <div class="puzzle-actions">
      <button class="btn ghost" id="hintBtn">💡 Hint<span class="btn-count${state.hints<=0?' zero':''}">${state.hints}</span></button>
      <button class="btn ghost" id="axeBtn">🪓 Golden Axe<span class="btn-count${state.axes<=0?' zero':''}">${state.axes}</span></button>
      <button class="btn ghost" id="shuffleBtn">🔀 Shuffle</button>
      ${anyDecoysLeft ? `<button class="btn ghost" id="decoyEraserBtn">🧹 Clear Decoys</button>` : ''}
      <button class="btn ghost" id="pleaBtn" ${pleaAvailable?'':'disabled'}>${pleaLabel}</button>
      ${(pleaAvailable && !pleaIsFree) ? `<button class="btn ghost gem-buy" id="pleaBtnGem">📣 Tribe Plea 💎${TRIBE_PLEA_GEM_COST}</button>` : ''}
    </div>`;
  }

  const allSolved = p.words.every(w=>w.solved);

  wrap.innerHTML = `
    <div class="panel">
      <h2 class="panel-title">${catDef.icon} ${catDef.label} Puzzle <span style="color:var(--text-dim); font-size:12px;">· ${diff.icon} ${diff.label}</span></h2>
      <p class="panel-sub">Tap letters below to spell each word in order. Tap a filled tile to undo it.${diff.decoysPerWord>0? ' Careful — a few letters in the bank belong to no word at all.':''}</p>
      ${rowsHtml}
      ${bankHtml}
      <div class="puzzle-progress">${p.words.filter(w=>w.solved).length} / ${p.words.length} words solved · 🪙${p.goldEarned} earned this puzzle</div>
      ${allSolved ? `<button class="btn primary block" id="finishPuzzle" style="margin-top:14px;">Collect &amp; Continue</button>` : `<button class="btn ghost block" id="abandonPuzzle" style="margin-top:14px;">⏩ Skip Puzzle — keep gold earned &amp; words already learned</button>`}
    </div>
  `;

  if(activeWord && !activeWord.solved){
    wrap.querySelectorAll('[data-tile]').forEach(t=>{
      t.addEventListener('click', ()=>{ playSound('tap'); placeTile(p.current, t.dataset.tile); });
    });
    document.getElementById('hintBtn').addEventListener('click', ()=>useHint(p.current));
    document.getElementById('axeBtn').addEventListener('click', ()=>useAxe(p.current));
    document.getElementById('shuffleBtn').addEventListener('click', ()=>{
      activeWord.tiles = shuffle(activeWord.tiles);
      renderAll();
    });
    const decoyBtn = document.getElementById('decoyEraserBtn');
    if(decoyBtn) decoyBtn.addEventListener('click', ()=>{
      // Removing a decoy that's currently placed in a blank would leave that
      // blank pointing at a tile id that no longer exists, so clear it first.
      activeWord.blanks = activeWord.blanks.map(tid=>{
        const t = tid!==null && activeWord.tiles.find(t=>t.id===tid);
        return (t && t.decoy) ? null : tid;
      });
      activeWord.tiles = activeWord.tiles.filter(t=>!t.decoy);
      toast('🧹 Decoy letters cleared for this word.');
      renderAll();
    });
    const pleaBtn = document.getElementById('pleaBtn');
    if(pleaBtn) pleaBtn.addEventListener('click', ()=>{
      const count = state.tribePleaCountToday || 0;
      if(count >= TRIBE_PLEA_MAX_PER_DAY) return;
      if(!activeWord.blanks.every(b=>b===null)) return; // only meant as a fresh-word head start
      const isFree = count === 0;
      const doPlea = ()=>{
        state.tribePleaCountToday = count + 1;
        const wi = p.current; // snapshot — wordSolved() may advance p.current mid-loop
        const revealCount = Math.min(2, activeWord.word.length);
        for(let i=0;i<revealCount;i++) useHintLikeAxe(wi);
        toast('📣 The tribe lends a hand — first letters revealed!');
      };
      if(isFree){
        doPlea();
      } else {
        if(state.gold < TRIBE_PLEA_GOLD_COST) return toast('Not enough gold');
        confirmAction({icon:'📣', title:'Tribe Plea', desc:`Spend 🪙${TRIBE_PLEA_GOLD_COST} gold to reveal the first letters of this word?`, confirmLabel:`🪙${TRIBE_PLEA_GOLD_COST} · Plea`, onConfirm:()=>{
          state.gold -= TRIBE_PLEA_GOLD_COST;
          doPlea();
        }});
      }
    });
    const pleaBtnGem = document.getElementById('pleaBtnGem');
    if(pleaBtnGem) pleaBtnGem.addEventListener('click', ()=>{
      const count = state.tribePleaCountToday || 0;
      if(count >= TRIBE_PLEA_MAX_PER_DAY || count === 0) return; // gem button only shown for paid uses
      if(!activeWord.blanks.every(b=>b===null)) return;
      if((state.gems||0) < TRIBE_PLEA_GEM_COST) return toast('Not enough gems');
      confirmAction({icon:'📣', title:'Tribe Plea', desc:`Spend 💎${TRIBE_PLEA_GEM_COST} gems to reveal the first letters of this word?`, confirmLabel:`💎${TRIBE_PLEA_GEM_COST} · Plea`, onConfirm:()=>{
        state.gems -= TRIBE_PLEA_GEM_COST;
        state.tribePleaCountToday = count + 1;
        const wi = p.current;
        const revealCount = Math.min(2, activeWord.word.length);
        for(let i=0;i<revealCount;i++) useHintLikeAxe(wi);
        toast('📣 The tribe lends a hand — first letters revealed!');
      }});
    });
  }
  wrap.querySelectorAll('.blank.filled').forEach(b=>{
    b.addEventListener('click', ()=>{
      const wi = parseInt(b.dataset.word), bi = parseInt(b.dataset.blank);
      if(wi!==p.current) return;
      removeTile(wi,bi);
    });
  });
  const finishBtn = document.getElementById('finishPuzzle');
  if(finishBtn) finishBtn.addEventListener('click', finishPuzzle);
  const abandonBtn = document.getElementById('abandonPuzzle');
  if(abandonBtn) abandonBtn.addEventListener('click', ()=>{ state.gold+=state.puzzle.goldEarned; state.puzzle=null; renderAll(); });
}

function placeTile(wi, tileId){
  const w = state.puzzle.words[wi];
  const tile = w.tiles.find(t=>t.id===tileId);
  if(!tile || tile.used) return;
  const emptyIdx = w.blanks.findIndex(b=>b===null);
  if(emptyIdx===-1) return;
  w.blanks[emptyIdx] = tileId;
  tile.used = true;

  if(w.blanks.every(b=>b!==null)){
    const guess = w.blanks.map(id=> w.tiles.find(t=>t.id===id).letter).join('');
    if(guess === w.word){
      wordSolved(wi);
    } else {
      renderAll();
      playSound('wrong');
      const row = document.getElementById('row-'+wi);
      if(row) row.classList.add('shake');
      const usingSafetyNet = !state.safetyNetUsedToday;
      setTimeout(()=>{
        if(usingSafetyNet){
          // Keep any letters that ended up in their correct position; only
          // clear the ones that are actually wrong. Consumes today's one
          // free use either way — the mistake still counts for spaced
          // repetition (flawless is still cleared below) so learning
          // tracking stays honest even when the board itself is cushioned.
          state.safetyNetUsedToday = true;
          w.blanks = w.blanks.map((tid,i)=>{
            if(tid===null) return null;
            const t = w.tiles.find(t=>t.id===tid);
            if(t && t.letter===w.word[i]) return tid; // correct position — keep it
            if(t) t.used = false; // wrong position — return the tile to the bank
            return null;
          });
        } else {
          w.blanks = w.blanks.map(()=>null);
          w.tiles.forEach(t=>t.used=false);
        }
        w.flawless = false;
        renderAll();
      }, 550);
      return;
    }
  }
  renderAll();
}

function removeTile(wi,bi){
  const w = state.puzzle.words[wi];
  const tileId = w.blanks[bi];
  if(tileId===null) return;
  const tile = w.tiles.find(t=>t.id===tileId);
  tile.used = false;
  w.blanks[bi] = null;
  renderAll();
}

function wordSolved(wi){
  playSound('solve');
  const p = state.puzzle;
  const w = p.words[wi];
  w.solved = true;
  const diff = DIFFICULTY[p.difficulty];

  // Review words (already in wordMemory — i.e. previously solved at least
  // once) pay a reduced base reward. Full reward is reserved for genuinely
  // new words; otherwise a player could deliberately fumble an easy word
  // to keep it cycling back via spaced repetition and farm full gold
  // indefinitely without learning anything new — that's a real economy
  // leak, not just a theoretical one, since due words get first pick over
  // fresh words every puzzle.
  const priorMem = state.wordMemory[p.category] && state.wordMemory[p.category][w.word];
  const isReview = !!priorMem;
  const REVIEW_REWARD_FACTOR = 0.05;
  const base = isReview ? Math.round(diff.rewardPerWord * REVIEW_REWARD_FACTOR) : diff.rewardPerWord;
  const bonus = w.flawless ? Math.round(base*0.25) : 0;
  let gained = base + bonus;

  const reqWord = isRequestWord(p.category, w.word);
  if(reqWord){
    const member = TRIBE_DATA.find(m=> m.category===p.category && state.tribe[m.id].request===w.word && !state.tribe[m.id].fulfilledToday);
    if(member){
      state.tribe[member.id].fulfilledToday = true;
      state.tribe[member.id].trust = Math.min(100, state.tribe[member.id].trust + 10);
      gained += 10;
      toast(`${member.name} is thrilled with "${w.word}"! +10 trust`);
    }
  }
  if(!w.flawless) p.fullyFlawless = false;
  updateWordMemory(p.category, w.word, w.flawless);
  p.goldEarned += gained;
  state.solvedCategoriesToday.add(p.category);

  const nextIdx = p.words.findIndex((ww,i)=> i>p.current && !ww.solved);
  if(nextIdx!==-1){
    p.current = nextIdx;
  } else {
    const anyUnsolved = p.words.findIndex(ww=>!ww.solved);
    if(anyUnsolved!==-1) p.current = anyUnsolved;
  }
  renderAll();
}

function useHint(wi){
  if(state.hints<=0) return;
  const w = state.puzzle.words[wi];
  const emptyIdx = w.blanks.findIndex(b=>b===null);
  if(emptyIdx===-1) return;
  const correctLetter = w.word[emptyIdx];
  const tile = w.tiles.find(t=> !t.used && t.letter===correctLetter);
  if(!tile) return;
  state.hints -= 1;
  w.flawless = false;
  w.blanks[emptyIdx] = tile.id;
  tile.used = true;
  if(w.blanks.every(b=>b!==null)){
    const guess = w.blanks.map(id=> w.tiles.find(t=>t.id===id).letter).join('');
    if(guess === w.word) wordSolved(wi); else renderAll();
  } else {
    renderAll();
  }
}

function useAxe(wi){
  if(state.axes<=0) return;
  state.axes -= 1;
  useHintLikeAxe(wi);
}
function useHintLikeAxe(wi){
  const w = state.puzzle.words[wi];
  const emptyIdx = w.blanks.findIndex(b=>b===null);
  if(emptyIdx===-1) return;
  const correctLetter = w.word[emptyIdx];
  const tile = w.tiles.find(t=> !t.used && t.letter===correctLetter);
  if(!tile) return;
  w.flawless = false;
  w.blanks[emptyIdx] = tile.id;
  tile.used = true;
  if(w.blanks.every(b=>b!==null)){
    const guess = w.blanks.map(id=> w.tiles.find(t=>t.id===id).letter).join('');
    if(guess === w.word) wordSolved(wi); else renderAll();
  } else {
    renderAll();
  }
}

function finishPuzzle(){
  const p = state.puzzle;
  const diff = DIFFICULTY[p.difficulty];
  let total = p.goldEarned;
  let masteryMsg = '';
  if(p.fullyFlawless){
    total += diff.masteryBonus;
    masteryMsg = ` + 🏅 Mastery Bonus ${diff.masteryBonus}`;
  }
  // Swift Solver — a silent, optional speed bonus. No timer or countdown is
  // ever shown during play (kept consistent with this game's no-pressure
  // design elsewhere, e.g. the Traveling Merchant's plain "until Day X"
  // instead of a countdown clock); the elapsed time is only checked once,
  // here, after the player has already finished on their own pace. Missing
  // it costs nothing — it only ever adds gold, never removes any.
  let swiftMsg = '';
  if(p.startedAt){
    const elapsedSeconds = (Date.now() - p.startedAt) / 1000;
    const swiftThreshold = diff.words * (20 + diff.decoysPerWord * 5);
    if(elapsedSeconds <= swiftThreshold){
      const swiftBonus = Math.round(diff.masteryBonus * 0.4);
      total += swiftBonus;
      swiftMsg = ` + ⚡ Swift Solver ${swiftBonus}`;
    }
  }
  let boosterMsg = '';
  if(state.boosterPuzzlesLeft>0){
    total *= 2;
    state.boosterPuzzlesLeft -= 1;
    boosterMsg = ` (📈 boosted x2, ${state.boosterPuzzlesLeft} left)`;
  }
  const paidOut = addGold(total);
  const crownNote = paidOut>total ? ` (👑 +${paidOut-total} crown bonus)` : '';
  toast(`Puzzle complete! +🪙${paidOut}${masteryMsg}${swiftMsg}${boosterMsg}${crownNote}`);
  playPuzzleEffect();
  playSound('complete');
  state.puzzle = null;
  renderAll();
  setTimeout(openTreasureChest, 2100);
}

/* Treasure chest: a small, transparent post-puzzle bonus — NOT a loot box.
   - Gold is always awarded, in a narrow disclosed range (5–15). There is no
     "nothing" outcome and no rare jackpot, since unpredictable near-miss/empty
     results are what make variable-reward mechanics behave like gambling.
   - A modest chance of one extra hint or energy point is layered on top,
     never in place of the guaranteed gold, so the expected value stays
     small and stable rather than swingy. */
function openTreasureChest(){
  playSound('chest');
  const goldReward = Math.floor(Math.random()*11) + 5; // 5–15 gold, always granted
  const paidOut = addGold(goldReward);
  let msg = `🎁 Treasure chest: +🪙${paidOut}`;

  const bonusRoll = Math.random();
  if(bonusRoll < 0.12 && state.energy < state.maxEnergy){
    state.energy += 1;
    msg += ' + ⚡1 energy!';
  } else if(bonusRoll < 0.30){
    state.hints += 1;
    msg += ' + 💡1 hint!';
  } else {
    msg += '!';
  }
  toast(msg);
  renderAll();
}

/* ============================= TRIBE TAB ============================= */

function maskRequestWord(word){
  // Show first letter + blanks for the rest, so the tribe tab hints at
  // the request without handing over the full answer (keeps the puzzle
  // itself — clue + letter arrangement — meaningful).
  return word.split('').map((ch,i)=> i===0 ? ch : '_').join(' ');
}

function renderTribe(){
  const wrap = document.getElementById('tab-tribe');
  let cards = '';
  TRIBE_DATA.forEach(m=>{
    const t = state.tribe[m.id];
    const tier = trustTier(t.trust);
    const catDef = WORDS[m.category];
    cards += `<div class="tribe-card">
      <div class="tribe-head">
        <div class="tribe-icon">${m.icon}</div>
        <div>
          <div class="tribe-name">${m.name}</div>
          <div class="tribe-role">${m.role} · ${catDef.label}</div>
        </div>
        <div class="tribe-trust-label">${trustTitle(t.trust)}<br>${t.trust}/100</div>
      </div>
      <div class="trust-bar"><div class="trust-fill" style="width:${t.trust}%"></div></div>
      <div class="tribe-request ${t.fulfilledToday?'done':''}">
        ${t.fulfilledToday ? `✅ Today's request fulfilled — thank you!` : `Today's request: solve <strong>${maskRequestWord(t.request)}</strong> (${t.request.length} letters) in a ${catDef.label} puzzle`}
      </div>
      ${!t.fulfilledToday ? `<button class="btn ghost small" data-reserve="${m.id}" ${t.reservedNextRequest?'disabled':''} style="margin-top:8px;">
        📋 ${t.reservedNextRequest ? 'Reserved for tomorrow ✓' : 'Reserve this request for tomorrow — 🪙5'}
      </button>` : ''}
      ${tier>0 ? `<div class="tribe-story">"${m.story[tier-1]}"</div>` : ''}
    </div>`;
  });
  wrap.innerHTML = `
    <div class="panel">
      <h2 class="panel-title"><span style="display:inline-flex; vertical-align:-3px; width:18px; height:18px; margin-inline-end:4px;">${TRIBE_ICON_SVG}</span>Tribe Members</h2>
      <p class="panel-sub">Each member specializes in one kind of word. Fulfill their daily request for bonus gold and trust — trust unlocks their story over time.</p>
    </div>
    <div class="tribe-grid">${cards}</div>
  `;
  wrap.querySelectorAll('[data-reserve]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.dataset.reserve;
      if(state.tribe[id].reservedNextRequest) return;
      if(state.gold<5) return toast('Not enough gold');
      state.gold -= 5;
      state.tribe[id].reservedNextRequest = true;
      toast('📋 Request reserved for tomorrow.');
      renderAll();
    });
  });
}

/* ============================= SHOP TAB ============================= */

function renderShop(){
  const wrap = document.getElementById('tab-shop');
  // Kick off (or reuse cached) live PI→USD fetch. Fires and forgets: if a
  // fresh rate lands, getPiPriceUSD() re-renders this tab itself so the
  // π buttons' USD lines pick it up without blocking this render.
  getPiPriceUSD();

  let skinRows = '';
  Object.entries(BUILDING_TYPES).forEach(([key,def])=>{
    const owned = state.skins[key] || [0];
    const equipped = state.equippedSkin[key] || 0;
    let dots = def.colors.map((c,i)=>{
      const isOwned = owned.includes(i);
      const isEq = equipped===i;
      return `<button class="skin-dot ${isEq?'active':''}" style="background:${c}; ${isOwned?'':'opacity:.35'}" data-skinkey="${key}" data-skinidx="${i}" title="${SHOP_SKINS[i]}"></button>`;
    }).join('');
    const ownsLegendary = owned.includes(3);
    const legendaryDot = `<button class="skin-dot legendary-dot ${equipped===3?'active':''}" style="${ownsLegendary?'':'opacity:.35'}" data-skinkey="${key}" data-skinidx="3" title="Legendary">👑</button>`;
    const sellableIdxs = owned.filter(i=>i>0);
    const sellOptions = sellableIdxs.map(i=>{
      const label = i===3 ? '👑 Legendary' : SHOP_SKINS[i];
      const suggested = i===3 ? 80 : 15;
      return `<option value="${i}" data-price="${suggested}">${label}</option>`;
    }).join('');
    const firstSuggested = sellableIdxs.length ? (sellableIdxs[0]===3?80:15) : 15;
    const sellRow = sellableIdxs.length
      ? `<div class="sell-row">
          <select class="sell-select" data-sellkey="${key}">${sellOptions}</select>
          <input type="number" class="sell-price" data-pricekey="${key}" min="1" max="1000000" value="${firstSuggested}" />
          <button class="btn ghost small" data-selllist="${key}">List</button>
        </div>`
      : '';
    skinRows += `<div class="shop-item skin-shop-item">
      <div class="shop-icon">${def.icon}</div>
      <div class="shop-info">
        <div class="shop-name">${def.name} skins</div>
        <div class="shop-desc">Cosmetic only — no effect on cost, speed, or production.</div>
        <div class="skin-row">${dots}${legendaryDot}</div>
        ${sellRow}
      </div>
      <div class="shop-buy-col">
        <button class="btn shop-buy" data-buyskin="${key}">🪙20 unlock</button>
        <button class="btn shop-buy gem-buy" data-buylegendary="${key}" ${ownsLegendary?'disabled':''}>${ownsLegendary?'👑 owned':'💎30 legendary'}</button>
      </div>
    </div>`;
  });

  const starterOfferWeekIdx = starterOfferWeekIndex();
  const starterOfferClaimed = (state.starterOfferClaimedWeeks||[]).includes(starterOfferWeekIdx);
  const starterOfferRow = starterOfferWeekIdx === -1 ? '' : `<div class="shop-item">
      <div class="shop-icon">\ud83c\udf31</div>
      <div class="shop-info">
        <div class="shop-name">${STARTER_OFFER_WEEKLY_GEMS[starterOfferWeekIdx]} Gems <span style="color:var(--green-bright); font-size:11px; font-weight:800;">Starter Offer \u00b7 Week ${starterOfferWeekIdx+1}/${STARTER_OFFER_WEEKLY_GEMS.length}</span></div>
        <div class="shop-desc">A small weekly entry offer for your first ${STARTER_OFFER_DAYS/7} weeks only, priced directly in \u03c0${STARTER_OFFER_PI} \u2014 fixed in Pi, not converted from USD, so it never moves with the market. One claim per week; the gem amount tapers each week, then the offer closes for good.</div>
      </div>
      <div class="pi-buy-col">
        <button class="btn shop-buy gem-buy" id="buyStarterOffer" ${starterOfferClaimed?'disabled':''}>${starterOfferClaimed?'\u2705 Claimed this week':`\u03c0${STARTER_OFFER_PI}`}</button>
      </div>
    </div>`;

  const gemPackRows = GEM_PACKS.map(p=>
    `<div class="shop-item ${p.whale?'whale-pack':''}">
      <div class="shop-icon">💎</div>
      <div class="shop-info">
        <div class="shop-name">${p.gems} Gems ${p.whale?'<span style="color:var(--gold-bright); font-size:11px; font-weight:800;">👑 Whale Pack</span>':(p.bestValue?'<span style="color:var(--gold-bright); font-size:11px; font-weight:800;">⭐ Best Value</span>':'')}</div>
        <div class="shop-desc">${p.whale?'For serious supporters — the biggest gem drop, at the best per-gem price in the store. ':''}Real Pi purchase. Gems buy convenience items and cosmetics — never a shortcut past actually solving a puzzle. Worth ≈🪙${p.gems*3} if spent through the store.</div>
      </div>
      <div class="pi-buy-col">
        <button class="btn shop-buy gem-buy" data-buygems="${p.gems}" data-usdprice="${p.usdPrice}">π${formatPiAmount(piAmountForUsd(p.usdPrice))}</button>
        <span class="pi-usd-price">$${p.usdPrice.toFixed(2)}</span>
      </div>
    </div>`
  ).join('');

  const goldPackRows = GOLD_PACKS.map(p=>
    `<div class="shop-item ${p.whale?'whale-pack':''}">
      <div class="shop-icon">🪙</div>
      <div class="shop-info">
        <div class="shop-name">${p.gold} Gold ${p.whale?'<span style="color:var(--gold-bright); font-size:11px; font-weight:800;">👑 Whale Pack</span>':(p.bestValue?'<span style="color:var(--gold-bright); font-size:11px; font-weight:800;">⭐ Best Value</span>':'')}</div>
        <div class="shop-desc">${p.whale?'For serious supporters — the biggest gold drop, at the best per-gold price in the store. ':''}Real Pi purchase, straight to gold — no gems step. Buying Gems above and converting is better value if you don't mind the extra tap.</div>
      </div>
      <div class="pi-buy-col">
        <button class="btn shop-buy gem-buy" data-buygold="${p.gold}" data-usdprice="${p.usdPrice}">π${formatPiAmount(piAmountForUsd(p.usdPrice))}</button>
        <span class="pi-usd-price">$${p.usdPrice.toFixed(2)}</span>
      </div>
    </div>`
  ).join('');

  const patronActive = isPatronActive();
  const patronPlusActive = isPatronPlusActive();
  const patronTierLabel = patronPlusActive ? 'Patron+' : 'Patron';
  const patronHtml = patronActive
    ? `<div class="shop-desc">${patronTierLabel} active until ${new Date(state.patronUntil).toDateString()}. Renewing either tier just adds ${PATRON_DAYS} more days on top; buying the other tier switches which one applies going forward (any Patron+ badge/frame you've already unlocked stays yours either way).</div>`
    : `<div class="shop-desc">$${PATRON_PRICE_USD.toFixed(2)}/month (≈π${formatPiAmount(piAmountForUsd(PATRON_PRICE_USD))} at today's rate), paid manually — nothing auto-renews or auto-charges you. Grants a patron badge and a small daily gem trickle while active. Purely optional support, no gameplay advantage.</div>`;
  const patronPlusHtml = `<div class="shop-desc">$${PATRON_PLUS_PRICE_USD.toFixed(2)}/month (≈π${formatPiAmount(piAmountForUsd(PATRON_PLUS_PRICE_USD))} at today's rate). Everything in Patron, plus a bigger daily gem trickle (💎5 vs 💎2) while active, and the exclusive ${PATRON_PLUS_BADGE.icon} ${PATRON_PLUS_BADGE.name} + ${PATRON_PLUS_FRAME.name} — granted permanently the first time, yours to keep even after it lapses.</div>`;

  const owned = state.ownedBadges || [];
  const badgeRows = BADGES.map(b=>{
    const isOwned = owned.includes(b.id);
    const isEquipped = state.equippedBadge === b.id;
    const buyOrEquip = isOwned
      ? `<button class="btn shop-buy ${isEquipped?'primary':''}" data-equipbadge="${b.id}">${isEquipped?'Equipped ✓':'Equip'}</button>`
      : `<div class="dual-buy">
          <button class="btn shop-buy primary" data-buybadge="${b.id}" data-badgecur="gold" ${state.gold<b.goldPrice?'disabled':''}>🪙${b.goldPrice}</button>
          <button class="btn shop-buy gem-buy" data-buybadge="${b.id}" data-badgecur="gems" ${(state.gems||0)<b.gemPrice?'disabled':''}>💎${b.gemPrice}</button>
        </div>`;
    return `<div class="shop-item">
      <div class="shop-icon">${b.icon}</div>
      <div class="shop-info">
        <div class="shop-name">${b.name}</div>
        <div class="shop-desc">${b.desc}</div>
      </div>
      ${buyOrEquip}
    </div>`;
  }).join('') + (()=>{
    const unlocked = state.prestigeCount > 0;
    const isEquipped = state.equippedBadge === FOUNDER_BADGE.id;
    return `<div class="shop-item">
      <div class="shop-icon">${FOUNDER_BADGE.icon}</div>
      <div class="shop-info">
        <div class="shop-name">${FOUNDER_BADGE.name}</div>
        <div class="shop-desc">${unlocked ? 'Earned — you founded a Dynasty.' : 'Locked — found your first Dynasty to earn this one. Cannot be bought.'}</div>
      </div>
      ${unlocked
        ? `<button class="btn shop-buy ${isEquipped?'primary':''}" data-equipbadge="${FOUNDER_BADGE.id}">${isEquipped?'Equipped ✓':'Equip'}</button>`
        : `<button class="btn shop-buy" disabled>🔒 Locked</button>`
      }
    </div>`;
  })();

  // Achievement Badges: real milestones, never for sale. Shown as their own
  // row set so they read visually distinct from the purchasable badges above
  // — locked ones show progress/requirement instead of a price.
  const achievementRows = ACHIEVEMENT_BADGES.map(a=>{
    const isOwned = owned.includes(a.id);
    const isEquipped = state.equippedBadge === a.id;
    return `<div class="shop-item">
      <div class="shop-icon">${a.icon}</div>
      <div class="shop-info">
        <div class="shop-name">${a.name}</div>
        <div class="shop-desc">${isOwned ? 'Earned!' : ''} ${a.desc}</div>
      </div>
      ${isOwned
        ? `<button class="btn shop-buy ${isEquipped?'primary':''}" data-equipbadge="${a.id}">${isEquipped?'Equipped ✓':'Equip'}</button>`
        : `<button class="btn shop-buy" disabled>🔒 Locked</button>`
      }
    </div>`;
  }).join('');

  // Collections: completion status per set, each row showing which badges
  // are still missing. The reward frame itself is rendered further down in
  // the exclusive-frames block once earned.
  const collectionRows = COLLECTIONS.map(c=>{
    const ownedCount = c.badgeIds.filter(id=>owned.includes(id)).length;
    const complete = ownedCount === c.badgeIds.length;
    const missing = c.badgeIds.filter(id=>!owned.includes(id)).map(id=>{
      const b = findBadge(id);
      return b ? b.icon : '?';
    }).join(' ');
    return `<div class="shop-item">
      <div class="shop-icon">${complete ? '🏅' : '📦'}</div>
      <div class="shop-info">
        <div class="shop-name">${c.name} (${ownedCount}/${c.badgeIds.length})</div>
        <div class="shop-desc">${c.desc}${complete ? ' Complete!' : ` Still need: ${missing}`}</div>
      </div>
    </div>`;
  }).join('');

  // Exclusive collection-reward frames: only ever appear here once earned —
  // there's never a buy button because COLLECTION_FRAMES has no prices and
  // buyFrame() only reads from BADGE_FRAMES.
  const ownedFramesForCollections = state.ownedFrames || [];
  const collectionFrameRows = COLLECTION_FRAMES.map(f=>{
    const isOwned = ownedFramesForCollections.includes(f.id);
    const isEquipped = state.equippedFrame === f.id;
    return `<div class="shop-item">
      <div class="shop-icon"><span class="name-badge frame-${f.id}">${state.equippedBadge ? findBadge(state.equippedBadge).icon : '⭐'}</span></div>
      <div class="shop-info">
        <div class="shop-name">${f.name}</div>
        <div class="shop-desc">${isOwned ? '' : 'Locked — '}${f.desc}</div>
      </div>
      ${isOwned
        ? `<button class="btn shop-buy ${isEquipped?'primary':''}" data-equipframe="${f.id}">${isEquipped?'Equipped ✓':'Equip'}</button>`
        : `<button class="btn shop-buy" disabled>🔒 Locked</button>`
      }
    </div>`;
  }).join('');

  // Gift-exclusive badges: same locked/equip-only pattern as
  // collectionFrameRows above — no buy button, since GIFT_EXCLUSIVE_BADGES
  // has no prices and buyBadge() only reads from BADGES. Shows up here once
  // received via sendGift() so the player has somewhere to equip it.
  const ownedBadgesForGifts = state.ownedBadges || [];
  const giftExclusiveBadgeRows = GIFT_EXCLUSIVE_BADGES.map(b=>{
    const isOwned = ownedBadgesForGifts.includes(b.id);
    const isEquipped = state.equippedBadge === b.id;
    return `<div class="shop-item">
      <div class="shop-icon">${b.icon}</div>
      <div class="shop-info">
        <div class="shop-name">${b.name}</div>
        <div class="shop-desc">${isOwned ? '' : 'Locked — '}${b.desc}</div>
      </div>
      ${isOwned
        ? `<button class="btn shop-buy ${isEquipped?'primary':''}" data-equipbadge="${b.id}">${isEquipped?'Equipped ✓':'Equip'}</button>`
        : `<button class="btn shop-buy" disabled>🔒 Locked</button>`
      }
    </div>`;
  }).join('');

  // Same pattern for gift-exclusive frames.
  const giftExclusiveFrameRows = GIFT_EXCLUSIVE_FRAMES.map(f=>{
    const isOwned = ownedFramesForCollections.includes(f.id);
    const isEquipped = state.equippedFrame === f.id;
    return `<div class="shop-item">
      <div class="shop-icon"><span class="name-badge frame-${f.id}">${state.equippedBadge ? findBadge(state.equippedBadge).icon : '⭐'}</span></div>
      <div class="shop-info">
        <div class="shop-name">${f.name}</div>
        <div class="shop-desc">${isOwned ? '' : 'Locked — '}${f.desc}</div>
      </div>
      ${isOwned
        ? `<button class="btn shop-buy ${isEquipped?'primary':''}" data-equipframe="${f.id}">${isEquipped?'Equipped ✓':'Equip'}</button>`
        : `<button class="btn shop-buy" disabled>🔒 Locked</button>`
      }
    </div>`;
  }).join('');

  // Patron+ exclusive badge/frame — locked/equip-only, same pattern as
  // above, but ownership comes from becomePatronPlus() -> applyGrant()
  // rather than from a gift. Granted permanently on first purchase.
  const patronPlusBadgeOwned = ownedBadgesForGifts.includes(PATRON_PLUS_BADGE.id);
  const patronPlusBadgeEquipped = state.equippedBadge === PATRON_PLUS_BADGE.id;
  const patronPlusBadgeRow = `<div class="shop-item">
      <div class="shop-icon">${PATRON_PLUS_BADGE.icon}</div>
      <div class="shop-info">
        <div class="shop-name">${PATRON_PLUS_BADGE.name}</div>
        <div class="shop-desc">${patronPlusBadgeOwned ? '' : 'Locked — '}${PATRON_PLUS_BADGE.desc}</div>
      </div>
      ${patronPlusBadgeOwned
        ? `<button class="btn shop-buy ${patronPlusBadgeEquipped?'primary':''}" data-equipbadge="${PATRON_PLUS_BADGE.id}">${patronPlusBadgeEquipped?'Equipped ✓':'Equip'}</button>`
        : `<button class="btn shop-buy" disabled>🔒 Locked</button>`
      }
    </div>`;
  const patronPlusFrameOwned = ownedFramesForCollections.includes(PATRON_PLUS_FRAME.id);
  const patronPlusFrameEquipped = state.equippedFrame === PATRON_PLUS_FRAME.id;
  const patronPlusFrameRow = `<div class="shop-item">
      <div class="shop-icon"><span class="name-badge frame-${PATRON_PLUS_FRAME.id}">${state.equippedBadge ? findBadge(state.equippedBadge).icon : '⭐'}</span></div>
      <div class="shop-info">
        <div class="shop-name">${PATRON_PLUS_FRAME.name}</div>
        <div class="shop-desc">${patronPlusFrameOwned ? '' : 'Locked — '}${PATRON_PLUS_FRAME.desc}</div>
      </div>
      ${patronPlusFrameOwned
        ? `<button class="btn shop-buy ${patronPlusFrameEquipped?'primary':''}" data-equipframe="${PATRON_PLUS_FRAME.id}">${patronPlusFrameEquipped?'Equipped ✓':'Equip'}</button>`
        : `<button class="btn shop-buy" disabled>🔒 Locked</button>`
      }
    </div>`;

  // Frames are a modifier on whichever badge/charm is equipped, not a
  // separate icon — preview them using the player's actual equipped badge
  // (or a placeholder star if none is equipped yet) so the choice is legible.
  const ownedFrames = state.ownedFrames || [];
  const previewIcon = state.equippedBadge ? findBadge(state.equippedBadge).icon : '⭐';
  const frameNoneEquipped = !state.equippedFrame;
  const frameRows = `<div class="shop-item">
      <div class="shop-icon"><span class="name-badge">${previewIcon}</span></div>
      <div class="shop-info">
        <div class="shop-name">None</div>
        <div class="shop-desc">No frame around your badge.</div>
      </div>
      <button class="btn shop-buy ${frameNoneEquipped?'primary':''}" data-equipframe="none">${frameNoneEquipped?'Equipped ✓':'Equip'}</button>
    </div>` + BADGE_FRAMES.map(f=>{
    const isOwned = ownedFrames.includes(f.id);
    const isEquipped = state.equippedFrame === f.id;
    const buyOrEquip = isOwned
      ? `<button class="btn shop-buy ${isEquipped?'primary':''}" data-equipframe="${f.id}">${isEquipped?'Equipped ✓':'Equip'}</button>`
      : `<div class="dual-buy">
          <button class="btn shop-buy primary" data-buyframe="${f.id}" data-framecur="gold" ${state.gold<f.goldPrice?'disabled':''}>🪙${f.goldPrice}</button>
          <button class="btn shop-buy gem-buy" data-buyframe="${f.id}" data-framecur="gems" ${(state.gems||0)<f.gemPrice?'disabled':''}>💎${f.gemPrice}</button>
        </div>`;
    return `<div class="shop-item">
      <div class="shop-icon"><span class="name-badge frame-${f.id}">${previewIcon}</span></div>
      <div class="shop-info">
        <div class="shop-name">${f.name}</div>
        <div class="shop-desc">${f.desc}</div>
      </div>
      ${buyOrEquip}
    </div>`;
  }).join('');

  const ownedFx = state.ownedEffects || [];
  const noneEquipped = !state.equippedEffect;
  const effectRows = `<div class="shop-item">
      <div class="shop-icon">🚫</div>
      <div class="shop-info">
        <div class="shop-name">None</div>
        <div class="shop-desc">No effect when a puzzle is completed.</div>
      </div>
      <button class="btn shop-buy ${noneEquipped?'primary':''}" data-equipeffect="none">${noneEquipped?'Equipped ✓':'Equip'}</button>
    </div>` + PUZZLE_EFFECTS.map(e=>{
    const isOwned = ownedFx.includes(e.id);
    const isEquipped = state.equippedEffect === e.id;
    const buyOrEquip = isOwned
      ? `<button class="btn shop-buy ${isEquipped?'primary':''}" data-equipeffect="${e.id}">${isEquipped?'Equipped ✓':'Equip'}</button>`
      : `<div class="dual-buy">
          <button class="btn shop-buy primary" data-buyeffect="${e.id}" data-effectcur="gold" ${state.gold<e.goldPrice?'disabled':''}>🪙${e.goldPrice}</button>
          <button class="btn shop-buy gem-buy" data-buyeffect="${e.id}" data-effectcur="gems" ${(state.gems||0)<e.gemPrice?'disabled':''}>💎${e.gemPrice}</button>
        </div>`;
    return `<div class="shop-item">
      <div class="shop-icon">${e.icon}</div>
      <div class="shop-info">
        <div class="shop-name">${e.name}</div>
        <div class="shop-desc">${e.desc}</div>
      </div>
      ${buyOrEquip}
    </div>`;
  }).join('');

  const ownedAuras = state.ownedAuras || [];
  const auraNoneEquipped = !state.equippedAura;
  const auraRows = `<div class="shop-item">
      <div class="shop-icon">🚫</div>
      <div class="shop-info">
        <div class="shop-name">None</div>
        <div class="shop-desc">No glow around your buildings.</div>
      </div>
      <button class="btn shop-buy ${auraNoneEquipped?'primary':''}" data-equipaura="none">${auraNoneEquipped?'Equipped ✓':'Equip'}</button>
    </div>` + BUILDING_AURAS.map(a=>{
    const isOwned = ownedAuras.includes(a.id);
    const isEquipped = state.equippedAura === a.id;
    const buyOrEquip = isOwned
      ? `<button class="btn shop-buy ${isEquipped?'primary':''}" data-equipaura="${a.id}">${isEquipped?'Equipped ✓':'Equip'}</button>`
      : `<div class="dual-buy">
          <button class="btn shop-buy primary" data-buyaura="${a.id}" data-auracur="gold" ${state.gold<a.goldPrice?'disabled':''}>🪙${a.goldPrice}</button>
          <button class="btn shop-buy gem-buy" data-buyaura="${a.id}" data-auracur="gems" ${(state.gems||0)<a.gemPrice?'disabled':''}>💎${a.gemPrice}</button>
        </div>`;
    return `<div class="shop-item">
      <div class="shop-icon"><span style="display:inline-block; width:18px; height:18px; border-radius:50%; background:${a.color}; box-shadow:0 0 8px ${a.color};"></span></div>
      <div class="shop-info">
        <div class="shop-name">${a.name}</div>
        <div class="shop-desc">${a.desc}</div>
      </div>
      ${buyOrEquip}
    </div>`;
  }).join('');

  const ownedSounds = state.ownedSoundPacks || [];
  const soundNoneEquipped = !state.equippedSoundPack;
  const defaultEquipped = state.equippedSoundPack === 'default';
  const soundRows = `<div class="shop-item">
      <button class="btn ghost small" data-previewsound="default" title="Preview" style="min-width:34px;">▶</button>
      <div class="shop-info">
        <div class="shop-name">${DEFAULT_SOUND_PACK.name} <span class="owned-tag">Free</span></div>
        <div class="shop-desc">${DEFAULT_SOUND_PACK.desc}</div>
      </div>
      <button class="btn shop-buy ${defaultEquipped?'primary':''}" data-equipsound="default">${defaultEquipped?'Equipped ✓':'Equip'}</button>
    </div>
    <div class="shop-item">
      <div class="shop-icon">🚫</div>
      <div class="shop-info">
        <div class="shop-name">None</div>
        <div class="shop-desc">Silent — no sound effects.</div>
      </div>
      <button class="btn shop-buy ${soundNoneEquipped?'primary':''}" data-equipsound="none">${soundNoneEquipped?'Equipped ✓':'Equip'}</button>
    </div>` + SOUND_PACKS.map(p=>{
    const isOwned = ownedSounds.includes(p.id);
    const isEquipped = state.equippedSoundPack === p.id;
    const buyOrEquip = isOwned
      ? `<button class="btn shop-buy ${isEquipped?'primary':''}" data-equipsound="${p.id}">${isEquipped?'Equipped ✓':'Equip'}</button>`
      : `<div class="dual-buy">
          <button class="btn shop-buy primary" data-buysound="${p.id}" data-soundcur="gold" ${state.gold<p.goldPrice?'disabled':''}>🪙${p.goldPrice}</button>
          <button class="btn shop-buy gem-buy" data-buysound="${p.id}" data-soundcur="gems" ${(state.gems||0)<p.gemPrice?'disabled':''}>💎${p.gemPrice}</button>
        </div>`;
    return `<div class="shop-item">
      <button class="btn ghost small" data-previewsound="${p.id}" title="Preview" style="min-width:34px;">▶</button>
      <div class="shop-info">
        <div class="shop-name">${p.name}</div>
        <div class="shop-desc">${p.desc}</div>
      </div>
      ${buyOrEquip}
    </div>`;
  }).join('');

  wrap.innerHTML = `
    <div class="panel">
      <h2 class="panel-title">🛒 The Market</h2>
      <p class="panel-sub">Gold or gems both work here. Nothing here skips a puzzle or hands you a building outright — it only buys aids you could otherwise earn by playing.</p>
      <div class="shop-grid">
        <div class="shop-item">
          <div class="shop-icon">💡</div>
          <div class="shop-info">
            <div class="shop-name">Hint Pack</div>
            <div class="shop-desc">+3 hints, reveals one letter at a time.</div>
          </div>
          <div class="dual-buy">
            <button class="btn shop-buy primary" id="buyHints">🪙30</button>
            <button class="btn shop-buy gem-buy" id="buyHintsGem">💎90</button>
          </div>
        </div>
        <div class="shop-item">
          <div class="shop-icon">🪓</div>
          <div class="shop-info">
            <div class="shop-name">Golden Axe</div>
            <div class="shop-desc">Frees one stuck letter instantly.</div>
          </div>
          <div class="dual-buy">
            <button class="btn shop-buy primary" id="buyAxe">🪙15</button>
            <button class="btn shop-buy gem-buy" id="buyAxeGem">💎45</button>
          </div>
        </div>
        <div class="shop-item">
          <div class="shop-icon">⚡</div>
          <div class="shop-info">
            <div class="shop-name">Energy Draught</div>
            <div class="shop-desc">+2 energy right now, for a longer session.</div>
          </div>
          <div class="dual-buy">
            <button class="btn shop-buy primary" id="buyEnergy">🪙25</button>
            <button class="btn shop-buy gem-buy" id="buyEnergyGem">💎75</button>
          </div>
        </div>
        <div class="shop-item">
          <div class="shop-icon">🧊</div>
          <div class="shop-info">
            <div class="shop-name">Streak Freeze</div>
            <div class="shop-desc">Protects your streak if you miss exactly one day. Stacks up to 3.</div>
          </div>
          <div class="dual-buy">
            <button class="btn shop-buy primary" id="buyFreeze">🪙40</button>
            <button class="btn shop-buy gem-buy" id="buyFreezeGem">💎120</button>
          </div>
        </div>
        <div class="shop-item">
          <div class="shop-icon">📈</div>
          <div class="shop-info">
            <div class="shop-name">Booster</div>
            <div class="shop-desc">Doubles gold from your next 3 puzzles.${state.boosterPuzzlesLeft>0?` <strong>${state.boosterPuzzlesLeft} boosted puzzles left.</strong>`:''}</div>
          </div>
          <div class="dual-buy">
            <button class="btn shop-buy primary" id="buyBooster">🪙60</button>
            <button class="btn shop-buy gem-buy" id="buyBoosterGem">💎150</button>
          </div>
        </div>
        <div class="shop-item">
          <div class="shop-icon">⚙️</div>
          <div class="shop-info">
            <div class="shop-name">Auto-Harvest</div>
            <div class="shop-desc">${state.autoHarvest ? 'Owned — building income now collects automatically once per day, even before you press "Rest until tomorrow."' : 'One-time purchase. Automates collecting building income daily — everything else (energy, tribe, puzzles) still needs you.'}</div>
          </div>
          ${state.autoHarvest
            ? `<button class="btn shop-buy" disabled>Owned</button>`
            : `<div class="dual-buy">
                <button class="btn shop-buy primary" id="buyAutoHarvest">🪙100</button>
                <button class="btn shop-buy gem-buy" id="buyAutoHarvestGem">💎300</button>
              </div>`
          }
        </div>
        <div class="shop-item">
          <div class="shop-icon">📣</div>
          <div class="shop-info">
            <div class="shop-name">Tribe Plea</div>
            <div class="shop-desc">First use each day is free — reveals the first 2 letters of a fresh word. 2 more uses available per day for 🪙${TRIBE_PLEA_GOLD_COST} or 💎${TRIBE_PLEA_GEM_COST} each, right from the puzzle screen.</div>
          </div>
          <button class="btn shop-buy" disabled>In puzzle</button>
        </div>
      </div>
    </div>

    <div class="panel">
      <h2 class="panel-title">💎 Gem Store <span style="font-size:11px; color:var(--text-dim); font-weight:600;">(real Pi)</span></h2>
      <p class="panel-sub">Gems are bought with real Pi. They can buy convenience items above and legendary cosmetics below — but never a building directly, and never a shortcut past actually solving a puzzle.</p>
      <div class="shop-grid">
        <div class="shop-item">
          <div class="shop-icon">♻️</div>
          <div class="shop-info">
            <div class="shop-name">Convert to Gold</div>
            <div class="shop-desc">10 💎 → 25 🪙. A fair option for spending real Pi on gold-only items above (buildings, consumables, market) without buying gems piece by piece.</div>
          </div>
          <button class="btn shop-buy gem-buy" id="convertGems">💎10 → 🪙25</button>
        </div>
        ${starterOfferRow}
        ${gemPackRows}
      </div>
    </div>

    <div class="panel">
      <h2 class="panel-title">🪙 Gold Pack <span style="font-size:11px; color:var(--text-dim); font-weight:600;">(real Pi)</span></h2>
      <p class="panel-sub">Buy gold directly with real Pi — a convenience shortcut for buildings, consumables, and the Player Market. Never a shortcut past actually solving a puzzle, same promise as everything else here.</p>
      <div class="shop-grid">
        ${goldPackRows}
      </div>
    </div>

    <div class="panel">
      <h2 class="panel-title">🎗️ Kingdom Patron</h2>
      <div class="shop-grid">
        <div class="shop-item">
          <div class="shop-icon">${patronActive?(patronPlusActive?'🎖️':'🎗️'):'🤍'}</div>
          <div class="shop-info">
            <div class="shop-name">${patronActive?`Active ${patronTierLabel}`:'Become a Patron'}</div>
            ${patronHtml}
          </div>
          <div class="pi-buy-col">
            <button class="btn shop-buy gem-buy" id="buyPatron">π${formatPiAmount(piAmountForUsd(PATRON_PRICE_USD))}</button>
            <span class="pi-usd-price">$${PATRON_PRICE_USD.toFixed(2)}</span>
          </div>
        </div>
        <div class="shop-item">
          <div class="shop-icon">🎖️</div>
          <div class="shop-info">
            <div class="shop-name">Become Patron+</div>
            ${patronPlusHtml}
          </div>
          <div class="pi-buy-col">
            <button class="btn shop-buy gem-buy" id="buyPatronPlus">π${formatPiAmount(piAmountForUsd(PATRON_PLUS_PRICE_USD))}</button>
            <span class="pi-usd-price">$${PATRON_PLUS_PRICE_USD.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <h2 class="panel-title">🎨 Building Skins</h2>
      <p class="panel-sub">Recolor any building you own. Purely for show.</p>
      <div class="shop-grid">${skinRows}</div>
    </div>

    <div class="panel">
      <h2 class="panel-title">🎖️ Badges</h2>
      <p class="panel-sub">Shown next to your kingdom's name in Rankings and on the City tab. Purely decorative — none of these reflect any particular achievement, so owning one is never mistaken for earning one. Tap Equip again to remove it.</p>
      <div class="shop-grid">${badgeRows}</div>
      <h3 style="color:var(--gold-bright); font-size:13.5px; margin:16px 0 4px;">🏆 Earned Badges</h3>
      <p class="panel-sub" style="margin-bottom:8px;">Real milestones — never for sale, so wearing one always means you actually did it.</p>
      <div class="shop-grid">${achievementRows}</div>
      <h3 style="color:var(--gold-bright); font-size:13.5px; margin:16px 0 4px;">🎁 Gifted Badges</h3>
      <p class="panel-sub" style="margin-bottom:8px;">Never sold — only received as a gift from another player (tap 🎁 next to a player in Rankings).</p>
      <div class="shop-grid">${giftExclusiveBadgeRows}</div>
      <h3 style="color:var(--gold-bright); font-size:13.5px; margin:16px 0 4px;">🎖️ Patron+ Badge</h3>
      <p class="panel-sub" style="margin-bottom:8px;">Never sold on its own — granted permanently the first time you become a Patron+ below.</p>
      <div class="shop-grid">${patronPlusBadgeRow}</div>
      <h3 style="color:var(--gold-bright); font-size:13.5px; margin:16px 0 4px;">Frame</h3>
      <p class="panel-sub" style="margin-bottom:8px;">A ring around your equipped badge above. Only visible once you have a badge equipped.</p>
      <div class="shop-grid">${frameRows}</div>
      <h3 style="color:var(--gold-bright); font-size:13.5px; margin:16px 0 4px;">🏅 Exclusive Collection Frames</h3>
      <p class="panel-sub" style="margin-bottom:8px;">Never sold — unlocked automatically by completing a collection below.</p>
      <div class="shop-grid">${collectionFrameRows}</div>
      <h3 style="color:var(--gold-bright); font-size:13.5px; margin:16px 0 4px;">🎁 Gifted Frames</h3>
      <p class="panel-sub" style="margin-bottom:8px;">Never sold — only received as a gift from another player.</p>
      <div class="shop-grid">${giftExclusiveFrameRows}</div>
      <h3 style="color:var(--gold-bright); font-size:13.5px; margin:16px 0 4px;">🎖️ Patron+ Frame</h3>
      <p class="panel-sub" style="margin-bottom:8px;">Never sold on its own — granted permanently the first time you become a Patron+ below.</p>
      <div class="shop-grid">${patronPlusFrameRow}</div>
    </div>

    <div class="panel">
      <h2 class="panel-title">📦 Collections</h2>
      <p class="panel-sub">Own every badge in a set to auto-unlock its exclusive frame above — a reason to collect a variety instead of just one favorite.</p>
      <div class="shop-grid">${collectionRows}</div>
    </div>

    <div class="panel">
      <h2 class="panel-title">🎉 Puzzle Effects</h2>
      <p class="panel-sub">A short celebration when you finish a whole puzzle (not per word). Purely decorative. "None" is always free.</p>
      <div class="shop-grid">${effectRows}</div>
    </div>

    <div class="panel">
      <h2 class="panel-title">🌟 Building Auras</h2>
      <p class="panel-sub">A soft glow applied to every building you own, all at once. Purely decorative — no effect on cost, speed, or production.</p>
      <div class="shop-grid">${auraRows}</div>
    </div>

    <div class="panel">
      <div class="market-header">
        <h2 class="panel-title" style="margin:0;">🔊 Sound Packs</h2>
        <button class="btn ghost small" id="soundMuteToggle">${state.soundMuted ? '🔇 Muted' : '🔊 Sound On'}</button>
      </div>
      <p class="panel-sub">Changes tap, solve, and treasure-chest sounds. Tap ▶ to preview before buying.</p>
      <div class="shop-grid">${soundRows}</div>
    </div>

    <div class="panel">
      <div class="market-header">
        <h2 class="panel-title" style="margin:0;">🏪 Player Market</h2>
        <button class="btn ghost small" id="marketRefresh">↻ Refresh</button>
      </div>
      <p class="panel-sub">Trade owned skins with other players for gold only — never for gems or Pi. A 10% fee applies when a listing sells.</p>
      <div class="market-tabs">
        <button class="market-tab active" data-markettab="browse">Browse</button>
        <button class="market-tab" data-markettab="mine">My Listings<span id="mineCount" class="btn-count" style="display:none;"></span></button>
      </div>
      <div id="marketListArea" class="market-grid"><p class="panel-sub">Loading listings…</p></div>
      <div id="marketMineArea" class="market-grid" style="display:none;"></div>
    </div>

    <div class="panel">
      <div class="fair-note">Fair play promise: gems and gold both buy convenience — hints, tools, energy, streak protection, cosmetics. Buildings are always earned with gold from solving puzzles, and nothing here skips a puzzle for you.</div>
      <div class="panel-sub" style="margin-top:8px;">Gems earned an in-game way: 💎2/day while your Patron pass is active.</div>
    </div>
  `;

  document.getElementById('buyHints').addEventListener('click', ()=>{
    if(state.gold<30) return toast('Not enough gold');
    confirmAction({icon:'💡', title:'Buy Hints', desc:'Spend 🪙30 gold for +3 hints?', confirmLabel:'🪙30 · Buy', onConfirm:()=>{
      state.gold-=30; state.hints+=3; toast('+3 hints'); renderAll();
    }});
  });
  document.getElementById('buyAxe').addEventListener('click', ()=>{
    if(state.gold<15) return toast('Not enough gold');
    confirmAction({icon:'🪓', title:'Buy Golden Axe', desc:'Spend 🪙15 gold for +1 Golden Axe?', confirmLabel:'🪙15 · Buy', onConfirm:()=>{
      state.gold-=15; state.axes+=1; toast('+1 Golden Axe'); renderAll();
    }});
  });
  document.getElementById('buyEnergy').addEventListener('click', ()=>{
    if(state.gold<25) return toast('Not enough gold');
    confirmAction({icon:'⚡', title:'Buy Energy', desc:'Spend 🪙25 gold for +2 energy?', confirmLabel:'🪙25 · Buy', onConfirm:()=>{
      state.gold-=25; state.energy+=2; toast('+2 energy'); renderAll();
    }});
  });
  document.getElementById('buyFreeze').addEventListener('click', ()=>{
    if(state.streakFreezes>=3) return toast('You already hold the max 3 freezes');
    if(state.gold<40) return toast('Not enough gold');
    confirmAction({icon:'🧊', title:'Buy Streak Freeze', desc:'Spend 🪙40 gold for +1 Streak Freeze?', confirmLabel:'🪙40 · Buy', onConfirm:()=>{
      state.gold-=40; state.streakFreezes+=1; toast('🧊 +1 Streak Freeze'); renderAll();
    }});
  });
  document.getElementById('buyHintsGem').addEventListener('click', ()=>{
    if((state.gems||0)<90) return toast('Not enough gems');
    confirmAction({icon:'💡', title:'Buy Hints', desc:'Spend 💎90 gems for +3 hints?', confirmLabel:'💎90 · Buy', onConfirm:()=>{
      state.gems-=90; state.hints+=3; toast('💎 +3 hints'); renderAll();
    }});
  });
  document.getElementById('buyAxeGem').addEventListener('click', ()=>{
    if((state.gems||0)<45) return toast('Not enough gems');
    confirmAction({icon:'🪓', title:'Buy Golden Axe', desc:'Spend 💎45 gems for +1 Golden Axe?', confirmLabel:'💎45 · Buy', onConfirm:()=>{
      state.gems-=45; state.axes+=1; toast('💎 +1 Golden Axe'); renderAll();
    }});
  });
  document.getElementById('buyEnergyGem').addEventListener('click', ()=>{
    if((state.gems||0)<75) return toast('Not enough gems');
    confirmAction({icon:'⚡', title:'Buy Energy', desc:'Spend 💎75 gems for +2 energy?', confirmLabel:'💎75 · Buy', onConfirm:()=>{
      state.gems-=75; state.energy+=2; toast('💎 +2 energy'); renderAll();
    }});
  });
  document.getElementById('buyFreezeGem').addEventListener('click', ()=>{
    if(state.streakFreezes>=3) return toast('You already hold the max 3 freezes');
    if((state.gems||0)<120) return toast('Not enough gems');
    confirmAction({icon:'🧊', title:'Buy Streak Freeze', desc:'Spend 💎120 gems for +1 Streak Freeze?', confirmLabel:'💎120 · Buy', onConfirm:()=>{
      state.gems-=120; state.streakFreezes+=1; toast('💎🧊 +1 Streak Freeze'); renderAll();
    }});
  });
  document.getElementById('buyBooster').addEventListener('click', ()=>{
    if(state.gold<60) return toast('Not enough gold');
    confirmAction({icon:'📈', title:'Buy Booster', desc:'Spend 🪙60 gold for a booster active on your next 3 puzzles?', confirmLabel:'🪙60 · Buy', onConfirm:()=>{
      state.gold-=60; state.boosterPuzzlesLeft+=3; toast('📈 Booster active for your next 3 puzzles'); renderAll();
    }});
  });
  document.getElementById('buyBoosterGem').addEventListener('click', ()=>{
    if((state.gems||0)<150) return toast('Not enough gems');
    confirmAction({icon:'📈', title:'Buy Booster', desc:'Spend 💎150 gems for a booster active on your next 3 puzzles?', confirmLabel:'💎150 · Buy', onConfirm:()=>{
      state.gems-=150; state.boosterPuzzlesLeft+=3; toast('💎📈 Booster active for your next 3 puzzles'); renderAll();
    }});
  });
  const buyAutoHarvest = document.getElementById('buyAutoHarvest');
  if(buyAutoHarvest) buyAutoHarvest.addEventListener('click', ()=>{
    if(state.gold<100) return toast('Not enough gold');
    confirmAction({icon:'⚙️', title:'Buy Auto-Harvest', desc:'Spend 🪙100 gold to make Auto-Harvest active from tomorrow on?', confirmLabel:'🪙100 · Buy', onConfirm:()=>{
      state.gold-=100; state.autoHarvest=true; toast('⚙️ Auto-Harvest active from tomorrow on'); renderAll();
    }});
  });
  const buyAutoHarvestGem = document.getElementById('buyAutoHarvestGem');
  if(buyAutoHarvestGem) buyAutoHarvestGem.addEventListener('click', ()=>{
    if((state.gems||0)<300) return toast('Not enough gems');
    confirmAction({icon:'⚙️', title:'Buy Auto-Harvest', desc:'Spend 💎300 gems to make Auto-Harvest active from tomorrow on?', confirmLabel:'💎300 · Buy', onConfirm:()=>{
      state.gems-=300; state.autoHarvest=true; toast('💎⚙️ Auto-Harvest active from tomorrow on'); renderAll();
    }});
  });
  document.getElementById('convertGems').addEventListener('click', ()=>{
    if((state.gems||0)<10) return toast('Need at least 10 gems to convert');
    confirmAction({icon:'🔄', title:'Convert Gems', desc:'Convert 💎10 gems into 🪙25 gold?', confirmLabel:'Convert', onConfirm:()=>{
      state.gems-=10; addGold(25); toast('Converted 💎10 → 🪙25'); renderAll();
    }});
  });
  const starterOfferBtn = document.getElementById('buyStarterOffer');
  if(starterOfferBtn) starterOfferBtn.addEventListener('click', buyStarterOffer);
  document.getElementById('buyPatron').addEventListener('click', becomePatron);
  document.getElementById('buyPatronPlus').addEventListener('click', becomePatronPlus);
  wrap.querySelectorAll('[data-buygems]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      buyGemPack({ gems: parseInt(btn.dataset.buygems), usdPrice: parseFloat(btn.dataset.usdprice) });
    });
  });
  wrap.querySelectorAll('[data-buygold]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      buyGoldPack({ gold: parseInt(btn.dataset.buygold), usdPrice: parseFloat(btn.dataset.usdprice) });
    });
  });
  wrap.querySelectorAll('[data-buylegendary]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const key = btn.dataset.buylegendary;
      if((state.skins[key]||[0]).includes(3)) return;
      if((state.gems||0) < 30) return toast('Not enough gems');
      confirmAction({icon:'👑', title:'Buy Legendary Skin', desc:`Spend 💎30 gems to unlock the legendary ${BUILDING_TYPES[key].name} skin?`, confirmLabel:'💎30 · Buy', onConfirm: async ()=>{
        const ok = await buyCosmetic({ kind:'skin', skinVariant:'legendary', buildingKey:key });
        if(ok) toast(`👑 Legendary ${BUILDING_TYPES[key].name} skin unlocked!`);
      }});
    });
  });
  wrap.querySelectorAll('[data-buyskin]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const key = btn.dataset.buyskin;
      if(!state.skins[key]) state.skins[key]=[0];
      // find first unowned index among the gold-bought colors only (index 3 is the gem-bought legendary tier)
      const def = BUILDING_TYPES[key];
      const unowned = def.colors.map((_,i)=>i).find(i=>!state.skins[key].includes(i));
      if(unowned===undefined) return toast('All standard skins unlocked');
      if(state.gold<20) return toast('Not enough gold');
      confirmAction({icon:'🎨', title:'Buy Skin', desc:`Spend 🪙20 gold to unlock a new ${def.name} skin?`, confirmLabel:'🪙20 · Buy', onConfirm: async ()=>{
        const ok = await buyCosmetic({ kind:'skin', skinVariant:'standard', buildingKey:key });
        if(ok) toast(`${def.name} skin unlocked!`);
      }});
    });
  });
  wrap.querySelectorAll('[data-buybadge]').forEach(btn=>{
    btn.addEventListener('click', ()=> buyBadge(btn.dataset.buybadge, btn.dataset.badgecur));
  });
  wrap.querySelectorAll('[data-equipbadge]').forEach(btn=>{
    btn.addEventListener('click', ()=> equipBadge(btn.dataset.equipbadge));
  });
  wrap.querySelectorAll('[data-buyframe]').forEach(btn=>{
    btn.addEventListener('click', ()=> buyFrame(btn.dataset.buyframe, btn.dataset.framecur));
  });
  wrap.querySelectorAll('[data-equipframe]').forEach(btn=>{
    btn.addEventListener('click', ()=> equipFrame(btn.dataset.equipframe));
  });
  wrap.querySelectorAll('[data-buyeffect]').forEach(btn=>{
    btn.addEventListener('click', ()=> buyEffect(btn.dataset.buyeffect, btn.dataset.effectcur));
  });
  wrap.querySelectorAll('[data-equipeffect]').forEach(btn=>{
    btn.addEventListener('click', ()=> equipEffect(btn.dataset.equipeffect));
  });
  wrap.querySelectorAll('[data-buyaura]').forEach(btn=>{
    btn.addEventListener('click', ()=> buyAura(btn.dataset.buyaura, btn.dataset.auracur));
  });
  wrap.querySelectorAll('[data-equipaura]').forEach(btn=>{
    btn.addEventListener('click', ()=> equipAura(btn.dataset.equipaura));
  });
  wrap.querySelectorAll('[data-buysound]').forEach(btn=>{
    btn.addEventListener('click', ()=> buySoundPack(btn.dataset.buysound, btn.dataset.soundcur));
  });
  wrap.querySelectorAll('[data-equipsound]').forEach(btn=>{
    btn.addEventListener('click', ()=> equipSoundPack(btn.dataset.equipsound));
  });
  wrap.querySelectorAll('[data-previewsound]').forEach(btn=>{
    btn.addEventListener('click', ()=> previewSoundPack(btn.dataset.previewsound));
  });
  const muteBtn = document.getElementById('soundMuteToggle');
  if(muteBtn) muteBtn.addEventListener('click', toggleSoundMute);
  wrap.querySelectorAll('[data-skinkey]').forEach(dot=>{
    dot.addEventListener('click', ()=>{
      const key = dot.dataset.skinkey, idx = parseInt(dot.dataset.skinidx);
      const owned = state.skins[key] || [0];
      if(!owned.includes(idx)) return toast('Unlock this skin first');
      state.equippedSkin[key]=idx;
      renderAll();
    });
  });
  wrap.querySelectorAll('[data-selllist]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const key = btn.dataset.selllist;
      const select = wrap.querySelector(`select[data-sellkey="${key}"]`);
      const priceInput = wrap.querySelector(`input[data-pricekey="${key}"]`);
      const idx = parseInt(select.value);
      const price = parseInt(priceInput.value);
      if(!Number.isInteger(price) || price<=0) return toast('Enter a valid price');
      listSkinForSale(key, idx, price);
    });
  });
  wrap.querySelectorAll('.sell-select').forEach(select=>{
    select.addEventListener('change', ()=>{
      const key = select.dataset.sellkey;
      const priceInput = wrap.querySelector(`input[data-pricekey="${key}"]`);
      priceInput.value = select.selectedOptions[0].dataset.price;
    });
  });

  renderMarketplacePanel();
}

/* ============================= PLAYER MARKET ============================= *
 * All trading logic lives server-side (netlify/functions/) — this panel just
 * fetches listings, and posts list/buy/cancel requests. See that file's
 * comments for why every step is re-verified on the server rather than
 * trusted from the client.
 * ------------------------------------------------------------------------- */
/* ============================= LEADERBOARD ============================= */
let leaderboardMetric = 'prestigeCount';
let leaderboardView = 'all'; // 'all' | 'following'
let leaderboardSearchQuery = '';
let cachedLeaderboardPlayers = null; // full unsliced player list from the last fetch, reused by search so typing doesn't re-fetch
const LEADERBOARD_METRICS = [
  { key:'prestigeCount', label:'Dynasties', icon:'👑', fmt:v=>v },
  { key:'totalDonated',  label:'Donations', icon:'🏛️', fmt:v=>fmtGold(v) },
  { key:'streak',        label:'Streak',    icon:'🔥', fmt:v=>v },
  { key:'gold',          label:'Gold',      icon:'🪙', fmt:v=>fmtGold(v) },
];
// Toggle a player in/out of this player's personal follow list. Purely
// local bookkeeping (saved with the rest of state via saveState()) — the
// followed player is never notified and nothing changes on their side.
function toggleFollow(playerId){
  state.followedPlayerIds = state.followedPlayerIds || [];
  const idx = state.followedPlayerIds.indexOf(playerId);
  if(idx===-1){ state.followedPlayerIds.push(playerId); toast('⭐ Following'); }
  else { state.followedPlayerIds.splice(idx,1); toast('Unfollowed'); }
  renderLeaderboardList();
  saveState();
}
async function renderLeaderboard(){
  const wrap = document.getElementById('tab-leaderboard');
  const metricDef = LEADERBOARD_METRICS.find(m=>m.key===leaderboardMetric);
  const tabsHtml = LEADERBOARD_METRICS.map(m=>
    `<button class="market-tab ${m.key===leaderboardMetric?'active':''}" data-lbmetric="${m.key}">${m.icon} ${m.label}</button>`
  ).join('');
  const followedCount = (state.followedPlayerIds||[]).length;
  const viewTabsHtml = `
    <button class="market-tab ${leaderboardView==='all'?'active':''}" data-lbview="all">🌍 All</button>
    <button class="market-tab ${leaderboardView==='following'?'active':''}" data-lbview="following">⭐ Following<span class="btn-count${followedCount<=0?' zero':''}">${followedCount}</span></button>
  `;

  wrap.innerHTML = `
    <div class="panel">
      <h2 class="panel-title">🏆 Kingdom Rankings</h2>
      <p class="panel-sub">See how your kingdom compares to other Pioneers. Rankings update whenever you check this tab. Tap ⭐ on a player to follow them — followed players stay saved for a quick "Following" view.</p>
      <div class="market-tabs">${viewTabsHtml}</div>
      <div class="market-tabs">${tabsHtml}</div>
      <input type="text" id="lbSearchInput" placeholder="🔍 Find a player by ID (e.g. pi_username) — not just top 50" value="${escapeHtml(leaderboardSearchQuery)}" style="width:100%; box-sizing:border-box; margin:8px 0; padding:8px 10px; border-radius:8px; border:1px solid var(--gold); background:transparent; color:var(--text); font-size:13px;" />
      <button class="btn ghost gift-history-toggle" id="giftHistoryToggle">🎁 Gift History ${giftHistoryOpen?'▲':'▼'}</button>
      <div id="giftHistoryWrap"></div>
      <div id="leaderboardList"><p class="panel-sub">Loading rankings…</p></div>
    </div>
  `;
  renderGiftHistory();
  document.getElementById('giftHistoryToggle').addEventListener('click', ()=>{
    giftHistoryOpen = !giftHistoryOpen;
    renderLeaderboard();
  });
  wrap.querySelectorAll('[data-lbmetric]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      leaderboardMetric = btn.dataset.lbmetric;
      wrap.querySelectorAll('[data-lbmetric]').forEach(b=>b.classList.toggle('active', b===btn));
      renderLeaderboardList();
    });
  });
  wrap.querySelectorAll('[data-lbview]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      leaderboardView = btn.dataset.lbview;
      wrap.querySelectorAll('[data-lbview]').forEach(b=>b.classList.toggle('active', b===btn));
      renderLeaderboardList();
    });
  });
  const searchInput = document.getElementById('lbSearchInput');
  searchInput.addEventListener('input', ()=>{
    leaderboardSearchQuery = searchInput.value.trim();
    renderLeaderboardList(); // uses cachedLeaderboardPlayers — no re-fetch per keystroke
  });

  const listEl = document.getElementById('leaderboardList');
  if(!API_BASE){
    listEl.innerHTML = `<p class="panel-sub">Rankings need the Netlify Functions backend deployed first (API_BASE is empty).</p>`;
    return;
  }
  try{
    const res = await fetch(`${API_BASE}/leaderboard`);
    cachedLeaderboardPlayers = await res.json();
  }catch(e){
    listEl.innerHTML = `<p class="panel-sub">Couldn't reach the rankings right now.</p>`;
    return;
  }
  renderLeaderboardList();
}

// Renders just the list portion from cachedLeaderboardPlayers — reused by
// metric/view tab clicks and by the search box so neither re-fetches or
// loses the player's typed query / scroll position.
function renderLeaderboardList(){
  const listEl = document.getElementById('leaderboardList');
  if(!listEl) return;
  const metricDef = LEADERBOARD_METRICS.find(m=>m.key===leaderboardMetric);
  const players = cachedLeaderboardPlayers;
  if(!Array.isArray(players) || players.length===0){
    listEl.innerHTML = `<p class="panel-sub">No rankings yet — be the first!</p>`;
    return;
  }
  const myId = getPlayerId();
  const followedIds = state.followedPlayerIds || [];
  let pool, isSearching = leaderboardSearchQuery.length>0;
  if(isSearching){
    // Search runs against every known player, not just the top-50 slice —
    // this is what lets someone find/follow/gift a player who'd otherwise
    // never appear (e.g. ranked outside the top 50 on every metric).
    const q = leaderboardSearchQuery.toLowerCase();
    pool = players.filter(p=> (p.displayName || p.playerId).toLowerCase().includes(q));
  } else if(leaderboardView==='following'){
    pool = players.filter(p=> followedIds.includes(p.playerId));
    if(pool.length===0){
      listEl.innerHTML = `<p class="panel-sub">You're not following anyone yet — switch to "All" and tap ⭐ next to a player, or search by ID above.</p>`;
      return;
    }
  } else {
    pool = players;
  }
  const sorted = [...pool].sort((a,b)=> (b[leaderboardMetric]||0) - (a[leaderboardMetric]||0)).slice(0, isSearching ? 20 : 50);
  // Global rank (against the full player list, not just the pool) is looked
  // up from a single pre-sorted pass + Map instead of re-sorting the entire
  // player list once per rendered row — that re-sort-per-row is what made
  // typing in the search box (which re-runs this on every keystroke) feel
  // heavy/laggy.
  const globalRanked = players.slice().sort((a,b)=> (b[leaderboardMetric]||0) - (a[leaderboardMetric]||0));
  const rankById = new Map(globalRanked.map((p,i)=>[p.playerId, i]));
  listEl.innerHTML = sorted.map((p)=>{
    const isMe = p.playerId===myId;
    const isFollowed = followedIds.includes(p.playerId);
    const rankInAll = rankById.get(p.playerId);
    // displayName comes from the server (leaderboard.js) — for a
    // pi_-identity player that's their Pi username, verified server-side
    // against Pi's own API when they saved, never derived from the
    // (now opaque, uid-based) playerId string itself. Falls back to the
    // old playerId-parsing behavior only for older/guest records that
    // predate this field.
    // escapeHtml here because displayName is a Pi username coming back from
    // the server (leaderboard.js) — trusted as "really belongs to that
    // account" but never sanitized for HTML safety, so it's untrusted from
    // this template's point of view same as any other external string.
    const name = escapeHtml(p.displayName || (p.playerId.replace(/^pi_|^guest_/,'') + (p.playerId.startsWith('guest_') ? ' (guest)' : '')));
    const badge = badgeTag(isMe ? state.equippedBadge : p.equippedBadge, isMe ? state.equippedFrame : p.equippedFrame);
    const medal = rankInAll===0?'🥇':rankInAll===1?'🥈':rankInAll===2?'🥉':`#${rankInAll+1}`;
    const followBtn = isMe ? '' : `<button class="btn ghost small" data-followplayer="${p.playerId}" title="${isFollowed?'Unfollow':'Follow'}">${isFollowed?'⭐':'☆'}</button>`;
    const giftBtn = isMe ? '' : `<button class="btn ghost small" data-giftplayer="${p.playerId}" title="Send a gift">🎁</button>`;
    const giftPanel = (giftPanelPlayerId===p.playerId) ? renderGiftPanel(p.playerId) : '';
    return `<div class="leaderboard-row ${isMe?'me':''}">
      <span class="lb-rank">${medal}</span>
      <span class="lb-name">${name}${badge}${isMe?' (you)':''}</span>
      <span class="lb-value">${metricDef.fmt(p[leaderboardMetric]||0)}</span>
      ${followBtn}
      ${giftBtn}
    </div>${giftPanel}`;
  }).join('');
  if(isSearching && sorted.length===0){
    listEl.innerHTML = `<p class="panel-sub">No player found matching "${escapeHtml(leaderboardSearchQuery)}".</p>`;
  }
  listEl.querySelectorAll('[data-followplayer]').forEach(btn=>{
    btn.addEventListener('click', ()=> toggleFollow(btn.dataset.followplayer));
  });
  listEl.querySelectorAll('[data-giftplayer]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.dataset.giftplayer;
      giftPanelPlayerId = (giftPanelPlayerId===id) ? null : id;
      renderLeaderboardList();
    });
  });
  listEl.querySelectorAll('[data-giftgold]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const amount = parseInt(btn.dataset.giftgold,10);
      const recipient = btn.dataset.giftrecipient.replace(/^pi_|^guest_/,'');
      confirmAction({icon:'🎁', title:'Send Gift', desc:`Send 🪙${amount} gold to ${recipient}?`, confirmLabel:`🪙${amount} · Send`, onConfirm:()=>{
        sendGift(btn.dataset.giftrecipient, 'gold', null, amount);
      }});
    });
  });
  listEl.querySelectorAll('[data-giftbadge]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const recipient = btn.dataset.giftrecipient.replace(/^pi_|^guest_/,'');
      confirmAction({icon:'🎁', title:'Send Gift', desc:`Send this badge to ${recipient}? You'll no longer be able to equip it yourself.`, confirmLabel:'Send Gift', onConfirm:()=>{
        sendGift(btn.dataset.giftrecipient, 'badge', btn.dataset.giftbadge);
      }});
    });
  });
  listEl.querySelectorAll('[data-giftframe]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const recipient = btn.dataset.giftrecipient.replace(/^pi_|^guest_/,'');
      confirmAction({icon:'🎁', title:'Send Gift', desc:`Send this frame to ${recipient}? You'll no longer be able to equip it yourself.`, confirmLabel:'Send Gift', onConfirm:()=>{
        sendGift(btn.dataset.giftrecipient, 'frame', btn.dataset.giftframe);
      }});
    });
  });
}

/* ============================= GIFTS ============================= *
 * Player-to-player gifting, spent from gold only (never gems — see
 * server.js's GIFTS section for why). Sending targets any player visible in
 * the Leaderboard; the gift panel below expands inline under that player's
 * row rather than as a separate modal, to stay lightweight on mobile.
 * ------------------------------------------------------------------------- */
let giftPanelPlayerId = null; // which leaderboard row currently has its gift panel open
let giftHistoryOpen = false; // whether the collapsible "Gift History" panel is expanded
const GIFT_HISTORY_LIMIT = 20; // client-side log only — trimmed to the most recent N so state.giftHistory can't grow unbounded
// Expanded canned-message set, now paired with an optional free-text field
// (see giftMessageCustom in renderGiftPanel). Canned messages stay a strict
// whitelist; custom text instead goes through sanitizeGiftMessage() below
// and the server's own mirror check — never trusted verbatim in either
// place. Must stay byte-for-byte identical to CANNED_GIFT_MESSAGES in
// server.js, since the server also accepts these exact strings unfiltered.
const CANNED_GIFT_MESSAGES = [
  'Congrats! 🎉', 'Thanks for playing together! 🤝', 'Good luck! 🍀', 'Enjoy! 🎁',
  'Well deserved! 👏', 'You inspire me! ✨', 'Keep it up! 💪', 'From one Pioneer to another 🏰',
];
// Must match GIFT_MESSAGE_MAX_LEN in server.js.
const GIFT_MESSAGE_MAX_LEN = 60;
// Blocks a custom gift message that contains a link or HTML-ish markup —
// mirrors the server's own check (server.js is still the authority; this
// is just so the player gets instant feedback instead of a round-trip
// rejection). Returns the trimmed message on success, or null + a toast
// explaining why on failure. An empty string is valid (means "no message").
function sanitizeGiftMessage(raw){
  const msg = (raw||'').trim();
  if(msg===''){
    return '';
  }
  if(msg.length > GIFT_MESSAGE_MAX_LEN){
    toast(`Message is too long — max ${GIFT_MESSAGE_MAX_LEN} characters.`);
    return null;
  }
  if(/[<>]/.test(msg)){
    toast("Message can't contain < or > characters.");
    return null;
  }
  if(/(https?:\/\/|www\.)/i.test(msg) || /\b[a-z0-9-]+\.(com|net|org|io|co|info|biz|xyz|ru|gg|app|dev|me|link|net|tv|shop)\b/i.test(msg)){
    toast("Message can't contain links.");
    return null;
  }
  return msg;
}
// Badge/frame chips offered here are the non-achievement BADGES/BADGE_FRAMES
// (mirrors GIFTABLE_BADGES / GIFTABLE_FRAMES server-side — Founder Badge and
// every ACHIEVEMENT_BADGES entry are deliberately absent, so a gift can never
// be the way someone gets an earned-only badge) PLUS the gift-exclusive
// GIFT_EXCLUSIVE_BADGES / GIFT_EXCLUSIVE_FRAMES, shown with a highlighted
// "exclusive" style since those can ONLY ever be obtained this way.
function renderGiftPanel(recipientId){
  const goldChips = [20,50,100].map(a=>
    `<button class="btn ghost small" data-giftgold="${a}" data-giftrecipient="${recipientId}" ${state.gold<a?'disabled':''}>🪙${a}</button>`
  ).join('');
  const badgeChips = BADGES.map(b=>
    `<button class="btn ghost small" data-giftbadge="${b.id}" data-giftrecipient="${recipientId}" ${state.gold<b.goldPrice?'disabled':''}>${b.icon} 🪙${b.goldPrice}</button>`
  ).join('') + GIFT_EXCLUSIVE_BADGES.map(b=>
    `<button class="btn ghost small gift-exclusive-chip" data-giftbadge="${b.id}" data-giftrecipient="${recipientId}" ${state.gold<b.goldPrice?'disabled':''} title="Exclusive — can't be bought, only gifted">${b.icon} 🪙${b.goldPrice} ✦</button>`
  ).join('');
  const frameChips = BADGE_FRAMES.map(f=>
    `<button class="btn ghost small" data-giftframe="${f.id}" data-giftrecipient="${recipientId}" ${state.gold<f.goldPrice?'disabled':''}>${f.name} 🪙${f.goldPrice}</button>`
  ).join('') + GIFT_EXCLUSIVE_FRAMES.map(f=>
    `<button class="btn ghost small gift-exclusive-chip" data-giftframe="${f.id}" data-giftrecipient="${recipientId}" ${state.gold<f.goldPrice?'disabled':''} title="Exclusive — can't be bought, only gifted">${f.name} 🪙${f.goldPrice} ✦</button>`
  ).join('');
  return `<div class="gift-panel">
    <div class="gift-panel-row">
      <span class="gift-panel-label">💬 Message</span>
      <select id="giftMessageSelect" class="gift-message-select">
        <option value="">No message</option>
        ${CANNED_GIFT_MESSAGES.map(m=>`<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join('')}
      </select>
    </div>
    <div class="gift-panel-row">
      <span class="gift-panel-label">✏️ Or write</span>
      <input type="text" id="giftMessageCustom" class="gift-message-custom" maxlength="${GIFT_MESSAGE_MAX_LEN}" placeholder="Your own message (optional)" />
      <p class="gift-message-hint">No links, no HTML — max ${GIFT_MESSAGE_MAX_LEN} characters. Overrides the dropdown above when filled in.</p>
    </div>
    <div class="gift-panel-row"><span class="gift-panel-label">🪙 Gold</span><div class="gift-chip-row">${goldChips}</div></div>
    <div class="gift-panel-row"><span class="gift-panel-label">🎖️ Badge</span><div class="gift-chip-row">${badgeChips}</div></div>
    <div class="gift-panel-row"><span class="gift-panel-label">🖼️ Frame</span><div class="gift-chip-row">${frameChips}</div></div>
    <p class="panel-sub" style="margin:6px 0 0;">Up to ${GIFT_DAILY_LIMIT_CLIENT} gifts/day. Paid from your gold — the recipient never pays anything. ✦ items can only ever be obtained as a gift.</p>
  </div>`;
}
const GIFT_DAILY_LIMIT_CLIENT = 5; // must match GIFT_DAILY_LIMIT in server.js — shown here only as a hint, the server enforces it

// Looks up a player's display name from the currently-cached leaderboard
// (which is where every path that has a recipientId/playerId to gift or
// log in the first place got it from) — falls back to the old
// playerId-parsing behavior only if that player isn't in the cache (or
// for pre-migration guest ids), since playerId is now an opaque Pi uid
// and no longer has a readable name embedded in it.
function displayNameForPlayerId(pid){
  const p = (cachedLeaderboardPlayers||[]).find(x=>x.playerId===pid);
  if(p && p.displayName) return p.displayName;
  return (pid||'').replace(/^pi_|^guest_/,'');
}

// Appends one entry to the local gift log and trims it to GIFT_HISTORY_LIMIT.
// Purely a client-side convenience view (the server doesn't keep a gift
// history) — persisted in state.giftHistory so it survives across sessions
// like any other save data.
function logGiftHistory(entry){
  state.giftHistory = state.giftHistory || [];
  state.giftHistory.unshift({ ...entry, at: Date.now() });
  if(state.giftHistory.length > GIFT_HISTORY_LIMIT) state.giftHistory.length = GIFT_HISTORY_LIMIT;
}
function renderGiftHistory(){
  const wrap = document.getElementById('giftHistoryWrap');
  if(!wrap) return;
  if(!giftHistoryOpen){ wrap.innerHTML = ''; return; }
  const entries = state.giftHistory || [];
  if(entries.length===0){
    wrap.innerHTML = `<div class="gift-history"><p class="gift-history-empty">No gifts sent or received yet — tap 🎁 next to a player in the rankings to send one.</p></div>`;
    return;
  }
  wrap.innerHTML = `<div class="gift-history">${entries.map(e=>{
    // escapeHtml: withName is a Pi username (fromUsername from the server,
    // see gift-send.js) — same "external, not HTML-safe" trust level as
    // displayName in renderLeaderboardList() above.
    const who = escapeHtml(e.withName || (e.withPlayerId||'').replace(/^pi_|^guest_/,''));
    const dir = e.dir==='sent' ? '↗️' : '↘️';
    const verb = e.dir==='sent' ? `You sent ${who}` : `${who} sent you`;
    return `<div class="gift-history-row"><span class="gift-history-dir">${dir}</span><span class="gift-history-text">${verb} ${escapeHtml(e.label)}${e.message?` — "${escapeHtml(e.message)}"`:''}</span></div>`;
  }).join('')}</div>`;
}

// Server-authoritative cosmetic purchase (badge/frame/effect/aura/
// soundpack/skin) — see cosmetic-buy.js. Deducts gold/gems and grants the
// item on the server, then adopts its returned state the same way
// purchaseWithPi() adopts a completed IAP's grantedState, rather than
// mutating state.gold/gems/ownedX locally and hoping the next autosave
// agrees (state-save.js no longer trusts a client-side purchase for any
// of these fields — see its own comments).
async function buyCosmetic(payload){
  if(!API_BASE) return toast('No purchase server configured yet.');
  try{
    const res = await fetch(`${API_BASE}/cosmetic-buy`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ playerId:getPlayerId(), ...payload, ...piAuthFields() }),
    });
    const data = await res.json();
    if(!res.ok || !data.grantedState){ toast(data.error || 'Purchase failed'); return false; }
    state = deserializeState(data.grantedState);
    renderAll();
    saveState();
    return true;
  }catch(e){ toast('Purchase failed — try again.'); return false; }
}

async function sendGift(recipientId, kind, itemId, amount){
  if(!API_BASE) return toast('No gift server configured yet.');
  const messageSelect = document.getElementById('giftMessageSelect');
  const messageCustomEl = document.getElementById('giftMessageCustom');
  const customRaw = messageCustomEl ? messageCustomEl.value : '';
  let message;
  if(customRaw && customRaw.trim()!==''){
    // Free-text message takes priority over the dropdown when filled in.
    const cleaned = sanitizeGiftMessage(customRaw);
    if(cleaned===null) return; // sanitizeGiftMessage already showed the reason via toast
    message = cleaned || undefined;
  } else {
    message = (messageSelect && messageSelect.value) ? messageSelect.value : undefined;
  }
  try{
    const res = await fetch(`${API_BASE}/gift-send`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ senderId:getPlayerId(), recipientId, kind, itemId, amount, message, ...piAuthFields() }),
    });
    const data = await res.json();
    if(!res.ok) return toast(data.error || 'Could not send gift');
    state.gold -= data.cost;
    const label = kind==='gold' ? `🪙${amount}` : (findBadge(itemId)?.icon ? `${findBadge(itemId).icon} ${findBadge(itemId).name}` : (findFrame(itemId)?.name || itemId));
    logGiftHistory({ dir:'sent', withPlayerId:recipientId, withName:displayNameForPlayerId(recipientId), label, message });
    toast('🎁 Gift sent!');
    giftPanelPlayerId = null;
    renderAll();
    saveState();
  }catch(e){ toast('Could not send gift — try again.'); }
}

// Applies any gifts other players sent since this player's last login, then
// clears the mailbox. Runs once at boot() — gifts show up "next time you
// open the game," not live mid-session (see server.js's GIFTS comment for
// why delivery works this way).
//
// SECURITY FIX (follow-up): this used to be the thing that actually
// granted the gift's gold/badge/frame (state.gold +=, ownedBadges.push,
// etc.) — trusted client-side, then persisted by whatever state-save.js
// was willing to accept at the time. Now that gift-send.js grants
// ownership directly into the recipient's server-side record the moment
// the gift is sent (see that file), `state` here — already loaded from
// the server via loadRemote()/state-get — already reflects the gift.
// Re-applying it here would double-count it. This function's job is now
// purely presentational: show the "you got a gift!" toast, log it to the
// gift history panel, and clear the now-delivered mailbox entries.
function applyPendingGifts(){
  const gifts = state.pendingGifts || [];
  if(gifts.length===0) return;
  gifts.forEach(g=>{
    // fromUsername is set server-side from a verified Pi identity at
    // send time (see gift-send.js) — never derived from the now-opaque,
    // uid-based fromPlayerId string. Falls back to the old parsing only
    // for gifts sent before this field existed.
    const fromName = g.fromUsername || (g.fromPlayerId||'').replace(/^pi_|^guest_/,'');
    let label = '';
    if(g.kind==='gold'){
      label = `🪙${g.amount}`;
      toast(`🎁 ${fromName} sent you 🪙${g.amount}!`);
    } else if(g.kind==='badge'){
      const b = findBadge(g.itemId);
      label = b ? `${b.icon} ${b.name}` : g.itemId;
      toast(`🎁 ${fromName} sent you the ${label}!`);
    } else if(g.kind==='frame'){
      const f = findFrame(g.itemId);
      label = f ? `${f.name} frame` : g.itemId;
      toast(`🎁 ${fromName} sent you the ${label}!`);
    }
    if(g.message) toast(`💌 "${g.message}"`);
    logGiftHistory({ dir:'received', withPlayerId:g.fromPlayerId, withName:fromName, label, message:g.message });
  });
  state.pendingGifts = [];
  checkCollections(); // a gifted badge/frame can complete a collection too
}

/* ============================= ABOUT US ============================= */
let aboutSubTab = 'privacy';
function renderAbout(){
  const wrap = document.getElementById('tab-about');
  const subtabs = [
    { key:'privacy', label:'Privacy' },
    { key:'terms',   label:'Terms of Use' },
    { key:'help',    label:'Help' },
  ];
  const tabsHtml = subtabs.map(t=>
    `<button class="market-tab ${t.key===aboutSubTab?'active':''}" data-aboutsub="${t.key}">${t.label}</button>`
  ).join('');

  const legalDisclaimer = `<div class="fair-note">⚠️ Placeholder draft — not legal advice, and not ready to publish as-is. Have a lawyer review and adapt this before launch, especially given real Pi payments and player-to-player trading happen in this app.</div>`;

  const content = {
    privacy: `
      ${legalDisclaimer}
      <h3>Privacy Policy (draft)</h3>
      <p class="panel-sub">Last updated: [date]</p>
      <p class="panel-sub"><strong>What we collect:</strong> your Pi username (if you sign in via the Pi Browser) or an anonymous guest ID, your in-game progress (gold, gems, buildings, streak, etc.), and payment records for any Pi transactions you make.</p>
      <p class="panel-sub"><strong>What we don't collect:</strong> we don't access your Pi wallet balance or private keys — payments go through Pi Network's own systems.</p>
      <p class="panel-sub"><strong>How it's stored:</strong> on our server, tied to your player ID, for as long as you keep playing. [Describe your actual retention/deletion policy here.]</p>
      <p class="panel-sub"><strong>Sharing:</strong> your username and public stats (gold, dynasties founded, etc.) are visible to other players in Rankings and the Player Market. [Confirm this matches what you actually want to expose.]</p>
      <p class="panel-sub"><strong>Your rights:</strong> [add how a player can request their data or ask for deletion — required in many jurisdictions, e.g. GDPR if you have EU/UK players.]</p>
      <p class="panel-sub"><strong>Contact:</strong> [your support email or contact method].</p>
    `,
    terms: `
      ${legalDisclaimer}
      <h3>Terms of Use (draft)</h3>
      <p class="panel-sub">Last updated: [date]</p>
      <p class="panel-sub"><strong>The basics:</strong> Kingdoms &amp; Words is a word-puzzle kingdom-builder. Gold and gems are virtual items with no real-world cash value and cannot be exchanged back for Pi or any other currency.</p>
      <p class="panel-sub"><strong>Purchases:</strong> Gem packs and the Patron pass are paid for with real Pi through Pi Network's payment system. [State your refund policy — this matters a lot for real-money purchases.]</p>
      <p class="panel-sub"><strong>Player Market:</strong> trades between players are for in-game gold only, facilitated by us for a commission. [Clarify what happens in disputes, and that listings/trades are final once completed.]</p>
      <p class="panel-sub"><strong>Fair play:</strong> [state your policy on cheating, exploiting bugs, multiple accounts, etc.]</p>
      <p class="panel-sub"><strong>Account &amp; termination:</strong> [under what conditions you can suspend or terminate an account.]</p>
      <p class="panel-sub"><strong>Liability:</strong> [standard limitation-of-liability language — get this from a lawyer, don't improvise it.]</p>
    `,
    help: `
      <h3>Help &amp; FAQ</h3>
      <p class="panel-sub"><strong>How do I earn gold?</strong> Solve word puzzles in the Words tab, collect daily building income, and fulfill Tribe requests.</p>
      <p class="panel-sub"><strong>What are gems for?</strong> Gems are bought with real Pi and spend on cosmetics and convenience items — never on skipping a puzzle or buying a building outright.</p>
      <p class="panel-sub"><strong>I lost my progress — can I get it back?</strong> Your kingdom is saved automatically. If you signed in with Pi, reopening the game and signing in again should restore it. [Add your actual support contact here for edge cases.]</p>
      <p class="panel-sub"><strong>How does the Player Market work?</strong> List a skin you own for gold in the Shop tab; other players can buy it there. A small fee applies when a sale completes.</p>
      <p class="panel-sub"><strong>Something's not working.</strong> [Add your support email, Discord, or other contact channel here.]</p>
    `,
  };

  wrap.innerHTML = `
    <div class="about-sticky-head">
      <h2 class="panel-title">ℹ️ About Us</h2>
      <p class="panel-sub">Kingdoms &amp; Words — a word-puzzle kingdom builder for Pi Browser.</p>
      <div class="market-tabs">${tabsHtml}</div>
    </div>
    <div class="about-content">${content[aboutSubTab]}</div>
  `;
  wrap.querySelectorAll('[data-aboutsub]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ aboutSubTab = btn.dataset.aboutsub; renderAbout(); });
  });
}

async function renderMarketplacePanel(){
  const listArea = document.getElementById('marketListArea');
  const mineArea = document.getElementById('marketMineArea');
  if(!listArea) return; // shop tab isn't showing right now

  if(!API_BASE){
    listArea.innerHTML = `<p class="panel-sub">No market server configured yet (API_BASE is empty) — the Player Market needs the Netlify Functions backend deployed first.</p>`;
    mineArea.innerHTML = '';
    return;
  }

  listArea.innerHTML = `<p class="panel-sub">Loading listings…</p>`;
  let listings;
  try{
    const res = await fetch(`${API_BASE}/market-listings`);
    listings = await res.json();
  }catch(e){
    listArea.innerHTML = `<p class="panel-sub">Couldn't reach the market right now.</p>`;
    return;
  }

  const myId = getPlayerId();
  const others = listings.filter(l=>l.sellerId!==myId).sort((a,b)=>a.price-b.price);
  const mine = listings.filter(l=>l.sellerId===myId);
  const mineCountEl = document.getElementById('mineCount');
  if(mineCountEl){
    if(mine.length){ mineCountEl.textContent = mine.length; mineCountEl.style.display = 'flex'; }
    else { mineCountEl.textContent = ''; mineCountEl.style.display = 'none'; }
  }

  function marketCard(l, isMine){
    const def = BUILDING_TYPES[l.buildingKey];
    const color = skinColor(l.buildingKey, l.skinIdx);
    const name = l.skinIdx===3 ? `Legendary ${def.name}` : `${SHOP_SKINS[l.skinIdx]} ${def.name}`;
    const seller = l.sellerId.replace(/^pi_|^guest_/,'');
    const canAfford = state.gold >= l.price;
    return `<div class="market-card ${l.skinIdx===3?'legendary':''}">
      <div class="market-tile" style="background:linear-gradient(160deg, ${color}33, var(--bg-panel-2)); border-color:${color}55;">
        <span class="mt-icon">${def.icon}</span>
        ${l.skinIdx===3?'<span class="mt-crown">👑</span>':''}
      </div>
      <div class="market-name">${name}</div>
      <div class="market-seller">${isMine ? 'Your listing' : seller}</div>
      ${isMine
        ? `<button class="btn ghost small market-action" data-cancellisting="${l.id}" data-listname="${escapeHtml(name)}" data-listprice="${l.price}">Cancel · 🪙${l.price}</button>`
        : `<button class="btn primary small market-action" data-buylisting="${l.id}" data-listname="${escapeHtml(name)}" data-listprice="${l.price}" ${canAfford?'':'disabled'}>🪙${l.price}</button>`
      }
    </div>`;
  }

  listArea.innerHTML = others.length
    ? others.map(l=>marketCard(l,false)).join('')
    : `<p class="panel-sub market-empty">No listings from other players right now — check back later, or list one of your own skins from the Building Skins panel above.</p>`;
  mineArea.innerHTML = mine.length
    ? mine.map(l=>marketCard(l,true)).join('')
    : `<p class="panel-sub market-empty">You have nothing listed. Pick an owned skin above and tap "List".</p>`;

  listArea.querySelectorAll('[data-buylisting]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const price = btn.dataset.listprice;
      const name = btn.dataset.listname;
      confirmAction({icon:'🛒', title:'Buy Listing', desc:`Buy ${name} for 🪙${price} gold from this player's listing?`, confirmLabel:`🪙${price} · Buy`, onConfirm: async ()=>{
        btn.disabled = true; btn.textContent = '…';
        try{
          const res = await fetch(`${API_BASE}/market-buy`, {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ listingId: btn.dataset.buylisting, buyerId: myId, ...piAuthFields() }),
          });
          const data = await res.json();
          if(!res.ok){ toast(data.error || 'Purchase failed'); btn.disabled=false; return; }
          state.gold -= data.paid;
          toast(`Bought for 🪙${data.paid}!`);
          const fresh = await loadRemote();
          if(fresh) state = fresh;
          renderAll();
        }catch(e){ toast('Purchase failed — try again.'); btn.disabled=false; }
      }});
    });
  });
  mineArea.querySelectorAll('[data-cancellisting]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const name = btn.dataset.listname;
      confirmAction({icon:'🗑️', title:'Cancel Listing', desc:`Cancel your listing for ${name}? The skin will be returned to you.`, confirmLabel:'Cancel Listing', onConfirm: async ()=>{
        btn.disabled = true;
        try{
          const res = await fetch(`${API_BASE}/market-cancel`, {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ listingId: btn.dataset.cancellisting, sellerId: myId, ...piAuthFields() }),
          });
          if(!res.ok){ toast('Could not cancel listing'); btn.disabled=false; return; }
          toast('Listing cancelled, skin returned.');
          const fresh = await loadRemote();
          if(fresh) state = fresh;
          renderAll();
        }catch(e){ toast('Could not cancel listing — try again.'); btn.disabled=false; }
      }});
    });
  });

  const refreshBtn = document.getElementById('marketRefresh');
  if(refreshBtn) refreshBtn.onclick = renderMarketplacePanel;
  document.querySelectorAll('.market-tab').forEach(tab=>{
    tab.onclick = ()=>{
      document.querySelectorAll('.market-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      const showMine = tab.dataset.markettab === 'mine';
      listArea.style.display = showMine ? 'none' : '';
      mineArea.style.display = showMine ? '' : 'none';
    };
  });
}

async function listSkinForSale(buildingKey, skinIdx, price){
  if(!API_BASE) return toast('No market server configured yet.');
  try{
    const res = await fetch(`${API_BASE}/market-list`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ sellerId: getPlayerId(), buildingKey, skinIdx, price, ...piAuthFields() }),
    });
    const data = await res.json();
    if(!res.ok) return toast(data.error || 'Could not list this skin');
    toast('Listed on the Player Market!');
    const fresh = await loadRemote();
    if(fresh) state = fresh;
    renderAll();
  }catch(e){ toast('Could not list this skin — try again.'); }
}


/* ============================= PI NETWORK INTEGRATION =============================
   This app runs fine in any browser (all of this is guarded), but when it's opened
   inside the Pi Browser it signs the Pioneer in with their Pi username so their
   kingdom is tied to their identity, and (if API_BASE points at a deployed server
   with PI_API_KEY configured) enables real Pi payments for gem packs and the Patron
   pass — see purchaseWithPi() above and netlify/functions/approve.js + complete.js. */

let piUser = null;
// SECURITY: captured from Pi.authenticate()'s response and sent to the
// backend on every player-specific request (see piAuthFields()/
// piAuthQuery() above) so the server can independently verify it against
// Pi's own /v2/me endpoint — never trusted here beyond "attach it to
// requests"; the backend is what actually treats it as proof of identity.
let piAccessToken = null;
const piInBrowser = typeof Pi !== 'undefined';

function onIncompletePaymentFound(payment){
  // Required by Pi.authenticate. Ask the server to finish whatever step
  // this payment was left on, same as a normal payment's flow — otherwise
  // an interrupted purchase (app closed mid-payment, etc.) can leave the
  // player stuck unable to start a new one.
  console.log('Incomplete Pi payment found, attempting to resume:', payment);
  if(payment && payment.identifier){
    fetch(`${API_BASE}/complete`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ paymentId: payment.identifier, txid: payment.transaction && payment.transaction.txid }),
    }).catch(e=>console.warn('Could not resume incomplete payment:', e));
  }
}

// Set to true while you're testing an unreviewed/unapproved app inside the
// Pi Browser's Sandbox (https://sandbox.minepi.com) — without this,
// Pi.authenticate() can hang indefinitely (never resolve, never reject) for
// an app that hasn't been approved for Mainnet yet, which is what makes the
// Log In button look stuck forever. Set it back to false once the app is
// live/approved and you're testing for real.
const PI_SANDBOX = true;

function authenticateWithPi(){
  const authPromise = Pi.authenticate(['username','payments'], onIncompletePaymentFound)
    .then((auth)=>{
      piUser = auth.user;
      piAccessToken = auth.accessToken;
      toast(`Welcome, ${piUser.username}! Your kingdom is linked to your Pi account.`);
    })
    .catch((err)=>{
      console.error('Pi authentication failed:', err);
    });
  // Safety net: if Pi.authenticate() never settles (known to happen when
  // sandbox/app-review state is mismatched), don't let the Log In button
  // hang forever — fall back to continuing as a guest after 8s.
  const timeout = new Promise((resolve)=>{
    setTimeout(()=>{
      console.warn('Pi authentication timed out after 8s — continuing without a Pi identity.');
      resolve();
    }, 8000);
  });
  return Promise.race([authPromise, timeout]);
}

// Returns a Promise that resolves once we know whether we have a Pi identity,
// so boot() can wait for it before deciding which save file to load.
function initPi(){
  if(!piInBrowser){
    console.log('Pi SDK not detected — running as a regular web app.');
    return Promise.resolve();
  }
  Pi.init({ version: "2.0", sandbox: PI_SANDBOX });
  return authenticateWithPi();
}

/* ============================= PI PAYMENTS ============================= *
 * Real-money purchases: gem packs and the monthly Patron pass. Everything
 * that's actually GRANTED happens server-side in netlify/functions/, using
 * only what Pi's own API says the payment was for — this client code just
 * kicks off the payment and reflects whatever the server confirms back.
 * See README.md before accepting real payments with this.
 * ------------------------------------------------------------------------- */
function purchaseWithPi(amount, memo, metadata){
  if(!piInBrowser){
    toast('Open this game inside the Pi Browser to make a purchase.');
    return;
  }
  if(!piUser){
    toast('Sign in with Pi first — trying again…');
    return;
  }
  if(!API_BASE){
    toast('This build has no payment backend configured yet (API_BASE is empty).');
    return;
  }
  Pi.createPayment({ amount, memo, metadata }, {
    onReadyForServerApproval: (paymentId)=>{
      fetch(`${API_BASE}/approve`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ paymentId }),
      }).catch(e=>console.error('Approve request failed:', e));
    },
    onReadyForServerCompletion: (paymentId, txid)=>{
      fetch(`${API_BASE}/complete`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ paymentId, txid }),
      })
        .then(r=>r.json())
        .then(data=>{
          if(data && data.grantedState){
            // The server is authoritative for what this purchase granted —
            // adopt its returned state rather than trusting a local guess.
            state = deserializeState(data.grantedState);
            toast('✅ Purchase complete!');
            renderAll();
          } else {
            toast('Payment completed, but the server response looked unexpected — check your balance.');
          }
        })
        .catch(e=>{ console.error('Complete request failed:', e); toast('Payment made, but confirming it failed — contact support if your balance looks wrong.'); });
    },
    onCancel: ()=> toast('Payment cancelled.'),
    onError: (error)=>{ console.error('Pi payment error:', error); toast('Payment failed — please try again.'); },
  });
}

/* ============================= PI → USD LIVE PRICE =============================
   Powers the small "≈$X.XX" line shown under every π-priced button (Gem
   packs, Gold packs, Patron/Patron+). Primary source: CoinGecko's public
   simple-price endpoint (no API key required). Fallback: CoinMarketCap —
   left as a stub (needs an API key + likely a backend proxy, since CMC
   blocks direct browser calls); wire COINMARKETCAP_API_KEY and/or replace
   fetchPiPriceFromCoinMarketCap() with your own function/variable when
   that's ready. If both fail, PI_PRICE_FALLBACK is used so the UI never
   shows a broken/blank price. */
let piUsdPrice = null;            // last known PI→USD rate, e.g. 0.092
let piUsdFetchedAt = 0;           // ms timestamp of the last successful fetch
let piUsdSource = null;           // 'coingecko' | 'coinmarketcap' | 'fallback'
const PI_PRICE_CACHE_MS = 5 * 60 * 1000; // re-fetch at most every 5 minutes
const PI_PRICE_FALLBACK = 0.092;  // static safety net if both APIs fail

// TODO(user): plug in a CoinMarketCap API key here (and likely proxy this
// call through your own backend — CMC's API does not allow direct browser
// requests). This function is only called if CoinGecko fails.
const COINMARKETCAP_API_KEY = '';
async function fetchPiPriceFromCoinMarketCap(){
  if(!COINMARKETCAP_API_KEY) throw new Error('CoinMarketCap API key not configured');
  const res = await fetch('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=PI', {
    headers: { 'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY }
  });
  if(!res.ok) throw new Error('CoinMarketCap request failed: ' + res.status);
  const data = await res.json();
  const usd = data && data.data && data.data.PI && data.data.PI[0] && data.data.PI[0].quote && data.data.PI[0].quote.USD && data.data.PI[0].quote.USD.price;
  if(typeof usd !== 'number') throw new Error('Unexpected CoinMarketCap response shape');
  return usd;
}

async function fetchPiPriceFromCoinGecko(){
  const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=pi-network&vs_currencies=usd');
  if(!res.ok) throw new Error('CoinGecko request failed: ' + res.status);
  const data = await res.json();
  const usd = data && data['pi-network'] && data['pi-network'].usd;
  if(typeof usd !== 'number') throw new Error('Unexpected CoinGecko response shape');
  return usd;
}

// Returns the cached PI→USD rate if still fresh, otherwise fetches a new
// one (CoinGecko first, CoinMarketCap fallback, static constant last
// resort) and re-renders the Shop tab so every π button's USD line
// updates in place. Concurrent calls share one in-flight fetch.
let piPriceFetchInFlight = null;
async function getPiPriceUSD(forceRefresh=false){
  const isFresh = piUsdPrice!==null && (Date.now()-piUsdFetchedAt) < PI_PRICE_CACHE_MS;
  if(isFresh && !forceRefresh) return piUsdPrice;
  if(piPriceFetchInFlight) return piPriceFetchInFlight;
  piPriceFetchInFlight = (async()=>{
    let usd, source;
    try{
      usd = await fetchPiPriceFromCoinGecko();
      source = 'coingecko';
    }catch(e1){
      try{
        usd = await fetchPiPriceFromCoinMarketCap();
        source = 'coinmarketcap';
      }catch(e2){
        usd = piUsdPrice!==null ? piUsdPrice : PI_PRICE_FALLBACK;
        source = 'fallback';
      }
    }
    const changed = usd !== piUsdPrice;
    piUsdPrice = usd;
    piUsdFetchedAt = Date.now();
    piUsdSource = source;
    piPriceFetchInFlight = null;
    // Only re-render if the Shop tab is actually visible, and only when
    // the rate actually changed — avoids pointless re-renders on a stale
    // hit from the fallback path.
    const shopTab = document.getElementById('tab-shop');
    if(changed && shopTab && shopTab.style.display !== 'none') renderShop();
    return usd;
  })();
  return piPriceFetchInFlight;
}

// Converts a fixed USD price into a Pi amount using the live cached rate
// (falls back to PI_PRICE_FALLBACK before the first fetch resolves), and
// rounds to a sane display/charge precision — 4 decimals under π0.01 so
// cheap items don't round to "π0.00", 2 decimals otherwise.
function piAmountForUsd(usd){
  const rate = piUsdPrice!==null ? piUsdPrice : PI_PRICE_FALLBACK;
  const raw = usd / rate;
  return raw < 0.01 ? Math.round(raw*10000)/10000 : Math.round(raw*100)/100;
}
function formatPiAmount(piAmount){
  return piAmount < 0.01 ? piAmount.toFixed(4) : piAmount.toFixed(2);
}

// All π-purchase prices are anchored in fixed USD — the USD figure never
// moves. The π amount shown/charged is recomputed from piAmountForUsd()
// on every render (and again at the moment of purchase) using the live
// PI→USD rate, so it's the Pi side that floats with the market, not the
// dollar side.
// The top tier of each list (whale:true) is the big-spender / "whale"
// package: continues the same per-unit discount curve as the tiers below
// it (so it's honestly the best per-gem/per-gold price too), but is
// marketed and styled separately (see .whale-pack CSS + 👑 badge) since
// its job is giving high-intent spenders a bigger ceiling to spend up to,
// not nudging the average player like the ⭐ Best Value mid-tier does.
// STARTER_OFFER: a 4-week onboarding series priced directly in Pi — NOT
// anchored to a USD figure like GEM_PACKS below, so its π cost never moves
// with the market. Exists for the large population of organic miners who
// hold small Pi balances (often around 10 Pi total) and take months to mine
// even 1 Pi: for them, GEM_PACKS' cheapest tier (~1 Pi at today's rate) is
// still a meaningful slice of their whole balance, even though it's a
// "cheap" $0.09 in USD terms. This offer is a small, fixed fraction of a Pi
// instead, so it reads as pocket change regardless of what Pi is worth.
// One claim per calendar week, for the account's first STARTER_OFFER_DAYS
// days only, then it closes for good — this is an onboarding ramp toward
// GEM_PACKS' regular pricing, not a permanent discount channel. The gem
// amount tapers week over week (only week 1 is the most generous) so it
// keeps narrowing toward GEM_PACKS' normal per-gem rate rather than staying
// a flat discount indefinitely.
// Eligibility and the once-per-week cap are enforced server-side in
// server.js against the account's own recorded creation date and claimed-
// weeks list — never trusted from the client alone — so it can't be reset
// or farmed by a high-balance account as a repeatable discount channel.
const STARTER_OFFER_PI = 0.2; // fixed Pi price, every week of the series
const STARTER_OFFER_WEEKLY_GEMS = [18, 14, 10, 8]; // week 1..4 (index 0..3)
const STARTER_OFFER_DAYS = 28; // the whole series closes for good this many days after account creation

// Returns 0-3 for "this account is currently in week N of the series", or
// -1 if not eligible (no known creation time yet, or past the window).
// Purely for client UI — server.js independently derives and enforces its
// own copy of this against its own records before granting anything.
function starterOfferWeekIndex(){
  if(!state.accountCreatedAt) return -1;
  const daysSince = (Date.now() - state.accountCreatedAt) / 86400000;
  if(daysSince < 0 || daysSince >= STARTER_OFFER_DAYS) return -1;
  return Math.floor(daysSince / 7);
}

function buyStarterOffer(){
  const weekIndex = starterOfferWeekIndex();
  if(weekIndex === -1){
    toast('The starter offer is no longer available for this account.');
    return;
  }
  if((state.starterOfferClaimedWeeks||[]).includes(weekIndex)){
    toast('Already claimed this week\u2019s starter offer \u2014 check back next week.');
    return;
  }
  const gems = STARTER_OFFER_WEEKLY_GEMS[weekIndex];
  confirmAction({icon:'\ud83c\udf31', title:`Starter Offer \u2014 Week ${weekIndex+1}`, desc:`One-time weekly offer: ${gems} gems for a fixed \u03c0${STARTER_OFFER_PI} \u2014 available once a week for your first ${STARTER_OFFER_DAYS/7} weeks only, price fixed in Pi so it never changes with the market. You'll confirm the payment in your Pi wallet next.`, confirmLabel:`\u03c0${STARTER_OFFER_PI} \u00b7 Continue`, onConfirm:()=>{
    purchaseWithPi(STARTER_OFFER_PI, `Starter Offer Week ${weekIndex+1} (${gems} Gems) \u2014 Kingdoms & Words`, { kind:'starter', gems, weekIndex });
  }});
}

const GEM_PACKS = [
  { gems:90,   usdPrice:0.09 },
  { gems:220,  usdPrice:0.18 },
  { gems:650,  usdPrice:0.46, bestValue:true },
  { gems:5000, usdPrice:2.99, whale:true },
];
function buyGemPack(pack){
  const piAmount = piAmountForUsd(pack.usdPrice);
  confirmAction({icon:'💎', title:'Buy Gems', desc:`Purchase ${pack.gems} gems for $${pack.usdPrice.toFixed(2)} (≈π${formatPiAmount(piAmount)} at today's Pi rate)? You'll confirm the payment in your Pi wallet next.`, confirmLabel:`π${formatPiAmount(piAmount)} · Continue`, onConfirm:()=>{
    purchaseWithPi(piAmount, `${pack.gems} Gems — Kingdoms & Words`, { kind:'gems', gems:pack.gems });
  }});
}

// Direct Gold purchase with real Pi — a convenience option alongside the
// Gems store above, for players who just want gold-only items (buildings,
// consumables, market listings) without the extra buy-gems-then-convert
// step. Deliberately priced worse per-dollar than buying Gems and using
// the 💎10→🪙25 conversion above, so Gems stay the smarter buy — this is
// a convenience tax, not a better deal.
const GOLD_PACKS = [
  { gold:140,  usdPrice:0.09 },
  { gold:320,  usdPrice:0.18 },
  { gold:900,  usdPrice:0.46, bestValue:true },
  { gold:7000, usdPrice:2.99, whale:true },
];
function buyGoldPack(pack){
  const piAmount = piAmountForUsd(pack.usdPrice);
  confirmAction({icon:'🪙', title:'Buy Gold', desc:`Purchase ${pack.gold} gold for $${pack.usdPrice.toFixed(2)} (≈π${formatPiAmount(piAmount)} at today's Pi rate)? You'll confirm the payment in your Pi wallet next.`, confirmLabel:`π${formatPiAmount(piAmount)} · Continue`, onConfirm:()=>{
    purchaseWithPi(piAmount, `${pack.gold} Gold — Kingdoms & Words`, { kind:'gold', gold:pack.gold });
  }});
}

// Cosmetic-only social badges — shown next to your name in Rankings and on
// the City tab. Deliberately don't reflect any in-game achievement (so
// owning one is never mistaken for "earning" something) — that's what the
// separate FOUNDER_BADGE below is for. Gold price is a flat 3x the gems
// price throughout, consistently pricier than paying with gems (bought with
// real Pi) so gems stay the better deal without gold being unusable.
const BADGES = [
  { id:'moon',    icon:'🌙', name:'Moon Badge',    gemPrice:50, goldPrice:150, desc:'A silver crescent that glows at night.' },
  { id:'star',    icon:'⭐', name:'Star Badge',    gemPrice:30, goldPrice:90,  desc:'A bright star that makes your presence known.' },
  { id:'flame',   icon:'🔥', name:'Flame Badge',   gemPrice:40, goldPrice:120, desc:'A burning flame that reflects your passion.' },
  { id:'blossom', icon:'🌸', name:'Blossom Badge', gemPrice:20, goldPrice:60,  desc:'A spring flower, a symbol of growth.' },
  { id:'falcon',  icon:'🦅', name:'Falcon Badge',  gemPrice:45, goldPrice:135, desc:'A bird of prey, a symbol of vision.' },
  { id:'dragon',  icon:'🐉', name:'Dragon Badge',  gemPrice:80, goldPrice:240, desc:'A legendary dragon that commands respect.' },
  { id:'compass', icon:'🧭', name:'Compass Badge', gemPrice:35, goldPrice:105, desc:'For the players who love to explore.' },
  { id:'clover',  icon:'🍀', name:'Clover Badge',  gemPrice:25, goldPrice:75,  desc:'A lucky four-leaf clover.' },
  // Lucky-charm set, merged into the same list rather than a separate shop
  // panel (same mechanic: one small icon next to your name). The proposed
  // clover charm reused the 🍀 icon already taken by Clover Badge above at a
  // different price, which would've made two visually-identical shop entries
  // — skipped, kept Clover Badge as the one 🍀 option.
  { id:'horseshoe', icon:'🧲', name:'Horseshoe Charm', gemPrice:25, goldPrice:75,  desc:'The traditional good-luck charm.' },
  { id:'evileye',   icon:'🧿', name:'Evil Eye Charm',  gemPrice:30, goldPrice:90,  desc:'Wards off envy.' },
  { id:'rabbitfoot',icon:'🐇', name:"Rabbit's Foot",   gemPrice:35, goldPrice:105, desc:'A symbol of speed and luck.' },
  // Purchasable lookalike for the Wordsmith Badge (see ACHIEVEMENT_BADGES).
  // Deliberately a different icon (📚 vs 📖) and a description that never
  // claims a word count, so it can't be mistaken for having earned that
  // milestone — buying it shows you like books, not that you solved 100 words.
  { id:'bookworm',  icon:'📚', name:'Bookworm Badge',  gemPrice:40, goldPrice:120, desc:'For lovers of words and reading. Doesn\'t track or require any word count.' },
];
// Free, non-purchasable — automatically granted the moment a player founds
// their first Dynasty (see doPrestige()). Kept separate from BADGES on
// purpose: it's the one badge that IS an achievement marker, so it can never
// be bought, sold, or otherwise obtained any other way.
const FOUNDER_BADGE = { id:'founder', icon:'🏆', name:'Founder Badge', desc:'Earned by founding your first Dynasty. Cannot be bought.' };

// Achievement Badges: like FOUNDER_BADGE, these are earned only — never
// sold, never in BADGES — so wearing one always means the underlying feat
// actually happened. Auto-granted by checkAchievementBadges() and stored in
// state.ownedBadges just like a purchased badge once earned, so the rest of
// the equip/collections code doesn't need to special-case them.
// Each has a purchasable "lookalike" back in BADGES (different icon, no
// achievement claim in its description) for players who like the vibe but
// don't want to wait — so a purchase is always visually distinguishable
// from the real thing, never a substitute for it.
const ACHIEVEMENT_BADGES = [
  {
    id:'wordsmith', icon:'📖', name:'Wordsmith Badge',
    desc:'Earned by solving 100 words total. Cannot be bought — see the Bookworm Badge below for a purchasable alternative with the same reading theme.',
    check:()=> totalWordsSolvedCount() >= 100,
  },
];
function totalWordsSolvedCount(){
  return Object.values(state.wordMemory||{}).reduce((sum,cat)=>sum+Object.keys(cat).length, 0);
}
// Checks every achievement badge's condition and grants any newly-earned
// ones. Safe to call often — it no-ops once a badge is already owned.
function checkAchievementBadges(){
  state.ownedBadges = state.ownedBadges || [];
  let earnedAny = false;
  ACHIEVEMENT_BADGES.forEach(a=>{
    if(!state.ownedBadges.includes(a.id) && a.check()){
      state.ownedBadges.push(a.id);
      toast(`${a.icon} ${a.name} unlocked!`);
      earnedAny = true;
    }
  });
  if(earnedAny) checkCollections();
}

// Collections: own every badge in a set (mix of purchasable BADGES and
// earned ACHIEVEMENT_BADGES) to auto-unlock an exclusive frame that can't be
// bought any other way — rewards variety across the badge shop rather than
// just picking one favorite. Reward frames live in COLLECTION_FRAMES, not
// BADGE_FRAMES, so buyFrame() can never sell them.
const COLLECTIONS = [
  {
    id:'luck', name:'Lucky Charms Collection',
    desc:'Own the Clover, Horseshoe, Evil Eye, and Rabbit\'s Foot to unlock this exclusive frame.',
    badgeIds:['clover','horseshoe','evileye','rabbitfoot'],
    rewardFrameId:'luck-collection',
  },
  {
    id:'skyward', name:'Skyward Collection',
    desc:'Own the Star, Moon, and Falcon badges to unlock this exclusive frame.',
    badgeIds:['star','moon','falcon'],
    rewardFrameId:'skyward-collection',
  },
];
const COLLECTION_FRAMES = [
  { id:'luck-collection',    name:'Fortune\'s Ring',   desc:'Reward for completing the Lucky Charms Collection. Cannot be bought.' },
  { id:'skyward-collection', name:'Skybound Ring',     desc:'Reward for completing the Skyward Collection. Cannot be bought.' },
];
function findCollectionFrame(id){
  return COLLECTION_FRAMES.find(f=>f.id===id) || null;
}
// Checks every collection's completion state and grants any newly-completed
// reward frame. Safe to call often — no-ops once a frame is already owned.
function checkCollections(){
  state.ownedBadges = state.ownedBadges || [];
  state.ownedFrames = state.ownedFrames || [];
  COLLECTIONS.forEach(c=>{
    if(state.ownedFrames.includes(c.rewardFrameId)) return;
    const complete = c.badgeIds.every(id=>state.ownedBadges.includes(id));
    if(complete){
      state.ownedFrames.push(c.rewardFrameId);
      const f = findCollectionFrame(c.rewardFrameId);
      toast(`🏅 ${c.name} complete! ${f.name} unlocked!`);
    }
  });
}

// Badge Frames: a decorative ring around whichever badge/charm is currently
// equipped — a modifier on the existing badge, not a second icon slot, so it
// stays invisible (and unpurchasable-as-pointless) when no badge is equipped.
const BADGE_FRAMES = [
  { id:'silver',  name:'Silver Frame',  gemPrice:15, goldPrice:45,  desc:'A sleek, matte frame.' },
  { id:'gold',    name:'Gold Frame',    gemPrice:20, goldPrice:60,  desc:'A classic gleaming frame.' },
  { id:'jeweled', name:'Jeweled Frame', gemPrice:40, goldPrice:120, desc:'A frame set with gemstones.' },
];

// Gift-exclusive cosmetics: never appear in the Shop tab and never
// purchasable for yourself (buyBadge()/buyFrame() only read from BADGES /
// BADGE_FRAMES above). The ONLY way to obtain one is receiving it as a gift
// from another player via renderGiftPanel() -> sendGift() -> the server's
// /api/gift/send. goldPrice here is what it costs the SENDER, mirrored
// server-side in GIFTABLE_BADGES / GIFTABLE_FRAMES — same "never trust the
// client for price" rule as everywhere else. Kept separate from BADGES /
// BADGE_FRAMES (rather than just adding a "giftOnly" flag to those lists) so
// findBadge()/renderShop() can never accidentally surface them for self-
// purchase — the fact that they live in a different array IS the guarantee.
const GIFT_EXCLUSIVE_BADGES = [
  { id:'friendship', icon:'🤝', name:'Friendship Badge', goldPrice:100, desc:'Cannot be bought — only received as a gift from another player.' },
];
const GIFT_EXCLUSIVE_FRAMES = [
  { id:'ribbon', name:'Ribbon Frame', goldPrice:90, desc:'Cannot be bought — only received as a gift from another player.' },
];

function findBadge(id){
  if(id===FOUNDER_BADGE.id) return FOUNDER_BADGE;
  if(id===PATRON_PLUS_BADGE.id) return PATRON_PLUS_BADGE;
  return BADGES.find(b=>b.id===id) || ACHIEVEMENT_BADGES.find(a=>a.id===id) || GIFT_EXCLUSIVE_BADGES.find(g=>g.id===id);
}
function findFrame(id){
  if(id===PATRON_PLUS_FRAME.id) return PATRON_PLUS_FRAME;
  return BADGE_FRAMES.find(f=>f.id===id) || findCollectionFrame(id) || GIFT_EXCLUSIVE_FRAMES.find(g=>g.id===id);
}
function buyBadge(id, currency){
  const b = BADGES.find(x=>x.id===id);
  if(!b) return;
  state.ownedBadges = state.ownedBadges || [];
  if(state.ownedBadges.includes(id)) return;
  const price = currency==='gems' ? b.gemPrice : b.goldPrice;
  const label = currency==='gems' ? `💎${price}` : `🪙${price}`;
  if(currency==='gems'){
    if((state.gems||0) < b.gemPrice) return toast('Not enough gems');
  } else {
    if(state.gold < b.goldPrice) return toast('Not enough gold');
  }
  confirmAction({icon:b.icon, title:`Buy ${b.name}`, desc:`Spend ${label} to unlock ${b.icon} ${b.name}?`, confirmLabel:`${label} · Buy`, onConfirm: async ()=>{
    const ok = await buyCosmetic({ kind:'badge', itemId:id, currency });
    if(ok){ toast(`${b.icon} ${b.name} unlocked!`); checkCollections(); }
  }});
}
function equipBadge(id){
  state.ownedBadges = state.ownedBadges || [];
  const owned = id===FOUNDER_BADGE.id ? (state.prestigeCount>0) : state.ownedBadges.includes(id);
  if(!owned) return;
  state.equippedBadge = (state.equippedBadge===id) ? null : id; // tap again to unequip
  renderAll();
}
function buyFrame(id, currency){
  const f = BADGE_FRAMES.find(x=>x.id===id);
  if(!f) return;
  state.ownedFrames = state.ownedFrames || [];
  if(state.ownedFrames.includes(id)) return;
  const price = currency==='gems' ? f.gemPrice : f.goldPrice;
  const label = currency==='gems' ? `💎${price}` : `🪙${price}`;
  if(currency==='gems'){
    if((state.gems||0) < f.gemPrice) return toast('Not enough gems');
  } else {
    if(state.gold < f.goldPrice) return toast('Not enough gold');
  }
  confirmAction({icon:'🖼️', title:`Buy ${f.name}`, desc:`Spend ${label} to unlock ${f.name}?`, confirmLabel:`${label} · Buy`, onConfirm: async ()=>{
    const ok = await buyCosmetic({ kind:'frame', itemId:id, currency });
    if(ok) toast(`${f.name} unlocked!`);
  }});
}
function equipFrame(id){
  state.ownedFrames = state.ownedFrames || [];
  const owned = id==='none' || state.ownedFrames.includes(id);
  if(!owned) return;
  state.equippedFrame = (id==='none') ? null : ((state.equippedFrame===id) ? null : id);
  renderAll();
}
// Small inline badge tag used next to a kingdom/player name. Takes the
// frame id separately (not always state.equippedFrame) because this also
// renders OTHER players' badges in the leaderboard, each with their own
// frame — never the local player's. Returns '' when no badge is equipped
// so callers can always splice it in unconditionally.
function badgeTag(id, frameId){
  if(!id) return '';
  const b = findBadge(id);
  if(!b) return '';
  const frameClass = frameId ? ` frame-${frameId}` : '';
  return `<span class="name-badge${frameClass}" title="${escapeHtml(b.name)}">${b.icon}</span>`;
}

// Puzzle Effects: a short celebratory particle burst on finishing a WHOLE
// puzzle (not per word — deliberately, to keep it a payoff rather than
// noise on every single word). Same gold/gems dual pricing pattern and 3x
// gold ratio as BADGES. 'none' is always available and free — equipping it
// just turns the feature off, since a purchase should never be a one-way
// door into an animation the player later doesn't want.
const PUZZLE_EFFECTS = [
  { id:'sparkles', icon:'✨', name:'Golden Sparkles', gemPrice:50, goldPrice:150, desc:'Golden sparks drift up around the puzzle.' },
  { id:'leaves',   icon:'🍃', name:'Falling Leaves',  gemPrice:45, goldPrice:135, desc:'Autumn leaves twirl gently upward.' },
  { id:'stars',    icon:'🌟', name:'Twinkling Stars', gemPrice:60, goldPrice:180, desc:'Small stars flicker in and out.' },
  { id:'blossoms', icon:'🌺', name:'Blooming Flowers',gemPrice:55, goldPrice:165, desc:'Flowers bloom around the finished puzzle.' },
  { id:'blueflame',icon:'🔥', name:'Blue Flame',      gemPrice:70, goldPrice:210, desc:'An enchanting blue flame flickers up.' },
];
function findEffect(id){
  return PUZZLE_EFFECTS.find(e=>e.id===id) || null;
}
function buyEffect(id, currency){
  const e = PUZZLE_EFFECTS.find(x=>x.id===id);
  if(!e) return;
  state.ownedEffects = state.ownedEffects || [];
  if(state.ownedEffects.includes(id)) return;
  const price = currency==='gems' ? e.gemPrice : e.goldPrice;
  const label = currency==='gems' ? `💎${price}` : `🪙${price}`;
  if(currency==='gems'){
    if((state.gems||0) < e.gemPrice) return toast('Not enough gems');
  } else {
    if(state.gold < e.goldPrice) return toast('Not enough gold');
  }
  confirmAction({icon:e.icon, title:`Buy ${e.name}`, desc:`Spend ${label} to unlock ${e.icon} ${e.name}?`, confirmLabel:`${label} · Buy`, onConfirm: async ()=>{
    const ok = await buyCosmetic({ kind:'effect', itemId:id, currency });
    if(ok) toast(`${e.icon} ${e.name} unlocked!`);
  }});
}
function equipEffect(id){
  // 'none' (or unowned ids, defensively) always resolves to turning effects off.
  const owned = (state.ownedEffects || []).includes(id);
  state.equippedEffect = (id!=='none' && owned) ? id : null;
  renderAll();
}
// Fires once when a whole puzzle is completed (see finishPuzzle()). Skips
// entirely — no DOM work at all — if no effect is equipped or the player
// prefers reduced motion, rather than relying on the CSS fallback alone.
function playPuzzleEffect(){
  const id = state.equippedEffect;
  if(!id) return;
  const eff = findEffect(id);
  if(!eff) return;
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const overlay = document.createElement('div');
  overlay.className = 'fx-overlay';
  const COUNT = 28;
  for(let i=0;i<COUNT;i++){
    const p = document.createElement('span');
    p.className = 'fx-particle';
    p.textContent = eff.icon;
    p.style.left = (5 + Math.random()*90) + 'vw';
    p.style.top = (30 + Math.random()*35) + 'vh';
    p.style.animationDelay = (Math.random()*0.7) + 's';
    overlay.appendChild(p);
  }
  document.body.appendChild(overlay);
  setTimeout(()=> overlay.remove(), 3300);
}

const PATRON_PRICE_USD = 0.28; // fixed USD anchor — π amount charged is computed live from this
const PATRON_DAYS = 30;
// Patron+ — a second, pricier tier alongside the original Patron pass.
// Reuses the same patronUntil expiry stacking mechanism (kind:'patron' with
// days:PATRON_DAYS), just with an added tier:'plus' flag that unlocks a
// bigger daily gem trickle while active AND a permanent exclusive
// badge/frame granted the first time (kept forever after that, same as
// every other cosmetic — see server.js applyGrant()).
// Edge case, same trade-off style as elsewhere in this file: buying regular
// Patron while Patron+ is already active switches state.patronTier back to
// 'basic' (lower trickle) even though the exclusive badge/frame stay owned
// forever — acceptable since it only ever affects the daily trickle amount,
// never anything already granted.
const PATRON_PLUS_PRICE_USD = 0.55; // fixed USD anchor, same pattern as PATRON_PRICE_USD
const PATRON_PLUS_DAYS = 30;
const PATRON_PLUS_BADGE = { id:'patron-plus', icon:'🎖️', name:'Patron+ Badge', desc:'Granted permanently the first time you become a Patron+. Cannot be bought separately.' };
const PATRON_PLUS_FRAME = { id:'patron-plus-frame', name:'Patron+ Frame', desc:'Granted permanently the first time you become a Patron+. Cannot be bought separately.' };
function isPatronActive(){
  return !!state.patronUntil && new Date(state.patronUntil).getTime() > Date.now();
}
function isPatronPlusActive(){
  return isPatronActive() && state.patronTier === 'plus';
}
function becomePatron(){
  const piAmount = piAmountForUsd(PATRON_PRICE_USD);
  confirmAction({icon:'🎖️', title:'Become Patron', desc:`Subscribe to Kingdom Patron for $${PATRON_PRICE_USD.toFixed(2)} (≈π${formatPiAmount(piAmount)} at today's Pi rate, ${PATRON_DAYS} days)? You'll confirm the payment in your Pi wallet next.`, confirmLabel:`π${formatPiAmount(piAmount)} · Continue`, onConfirm:()=>{
    purchaseWithPi(piAmount, `Kingdom Patron — ${PATRON_DAYS} days`, { kind:'patron', days:PATRON_DAYS });
  }});
}
function becomePatronPlus(){
  const piAmount = piAmountForUsd(PATRON_PLUS_PRICE_USD);
  confirmAction({icon:'🎖️', title:'Become Patron+', desc:`Subscribe to Kingdom Patron+ for $${PATRON_PLUS_PRICE_USD.toFixed(2)} (≈π${formatPiAmount(piAmount)} at today's Pi rate, ${PATRON_PLUS_DAYS} days)? You'll confirm the payment in your Pi wallet next.`, confirmLabel:`π${formatPiAmount(piAmount)} · Continue`, onConfirm:()=>{
    purchaseWithPi(piAmount, `Kingdom Patron+ — ${PATRON_PLUS_DAYS} days`, { kind:'patron', days:PATRON_PLUS_DAYS, tier:'plus' });
  }});
}

/* ============================= SAVE / LOAD ============================= *
 * Two layers:
 *   1. localStorage — always available, works the moment you open the file,
 *      and is the fallback if no server is configured or the network is down.
 *   2. Netlify Functions (see netlify/functions/) — set API_BASE below once you've
 *      deployed it, and the same save also syncs there so progress follows
 *      the player across devices/browsers instead of living in one browser only.
 * The save is keyed by identity: the player's Pi username if signed in via
 * the Pi Browser, otherwise a random guest id generated once and kept in
 * localStorage.
 * ------------------------------------------------------------------------- */

// Points at this same site's Netlify Functions (netlify/functions/) — the
// backend previously in server/ has been ported there, one function per
// endpoint, following the same pattern as the chesspi-board reference app.
// Leave this as "" instead to fall back to localStorage-only (no cross-
// device sync, no real Pi payments).
const API_BASE = "/.netlify/functions";

const LOCAL_KEY_PREFIX = 'kingdomsWords_save_';

// SECURITY: this must stay `pi_<uid>` — Pi's stable, opaque per-account ID
// — and NOT `pi_<username>` (an older version of this file used the
// username here). The backend independently re-derives this exact same
// `pi_<uid>` string from a verified Pi access token (see
// netlify/functions/_lib/identity.js) and only ever trusts THAT — never a
// playerId the client merely claims — so this client-side copy has to
// match it or every server call below would be resolving to a different
// identity than the one actually authenticated. `piUser.uid` comes
// straight from Pi.authenticate()'s response, the same trusted source the
// server re-checks against via GET /v2/me.
function getPlayerId(){
  if(piUser && piUser.uid) return 'pi_' + piUser.uid;
  let gid = localStorage.getItem('kw_guest_id');
  if(!gid){
    gid = 'guest_' + Date.now().toString(36) + Math.random().toString(36).slice(2,8);
    try{ localStorage.setItem('kw_guest_id', gid); }catch(e){ /* private browsing etc. */ }
  }
  return gid;
}

// Included in every request body/query string that touches player-specific
// data on the backend. When signed in via Pi, this carries the real Pi
// access token — the server verifies it against Pi's own API and derives
// the player's identity from THAT (see identity.js), ignoring whatever
// playerId the request also happens to include. When not signed in via Pi
// (guest play), this is empty and the server falls back to trusting the
// self-chosen guest_ id, same as before — there's no real Pi identity to
// verify for a guest.
function piAuthFields(){
  return piAccessToken ? { accessToken: piAccessToken } : {};
}
function piAuthQuery(){
  return piAccessToken ? `&accessToken=${encodeURIComponent(piAccessToken)}` : '';
}

// Sets aren't JSON-serializable, so convert the two Set-bearing fields
// to plain arrays on the way out, and back to Sets on the way in.
function serializeState(s){
  return {
    ...s,
    solvedCategoriesToday: Array.from(s.solvedCategoriesToday),
    wordHistory: Object.fromEntries(
      Object.entries(s.wordHistory).map(([k,v])=>[k, Array.from(v)])
    ),
  };
}
function deserializeState(obj){
  const fresh = freshState();
  const merged = { ...fresh, ...obj };
  merged.solvedCategoriesToday = new Set(obj.solvedCategoriesToday || []);
  merged.wordHistory = {};
  Object.entries(obj.wordHistory || {}).forEach(([k,v])=>{
    merged.wordHistory[k] = new Set(v);
  });
  // `obj.tribe` (if present) fully overwrote fresh.tribe above, which breaks
  // the Words/Tribe tabs for any save made before a member in TRIBE_DATA was
  // added — state.tribe[m.id] is undefined and rendering throws, leaving the
  // tab blank. Backfill any member missing from the saved data instead of
  // trusting the save to already have every current member.
  merged.tribe = { ...fresh.tribe, ...(obj.tribe || {}) };
  return merged;
}

function saveLocal(s){
  try{
    localStorage.setItem(LOCAL_KEY_PREFIX + getPlayerId(), JSON.stringify(serializeState(s)));
  }catch(e){ console.warn('localStorage save failed:', e); }
}
function loadLocal(){
  try{
    const raw = localStorage.getItem(LOCAL_KEY_PREFIX + getPlayerId());
    return raw ? deserializeState(JSON.parse(raw)) : null;
  }catch(e){ console.warn('localStorage load failed:', e); return null; }
}

async function saveRemote(s){
  if(!API_BASE) return;
  try{
    await fetch(`${API_BASE}/state-save`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ playerId: getPlayerId(), state: serializeState(s), ...piAuthFields() }),
    });
  }catch(e){ console.warn('Remote save failed, local save still has your progress:', e); }
}
async function loadRemote(){
  if(!API_BASE) return null;
  try{
    const res = await fetch(`${API_BASE}/state-get?playerId=${encodeURIComponent(getPlayerId())}${piAuthQuery()}`);
    if(!res.ok) return null;
    return deserializeState(await res.json());
  }catch(e){ console.warn('Remote load failed, falling back to local save:', e); return null; }
}

let _saveDebounce = null;
function saveState(){
  saveLocal(state);                     // instant, synchronous, always on
  clearTimeout(_saveDebounce);
  _saveDebounce = setTimeout(()=> saveRemote(state), 600); // batched network sync
}

/* ============================= INIT ============================= */
// Names the kingdom after the player's Pi username — capped at the first 7
// characters so it never overflows the City tab header. Runs after the save
// is loaded (state load replaces `state` wholesale) so it isn't clobbered,
// and re-applies every login so the name always reflects the signed-in
// account. Guests (no Pi identity) keep the generic default from freshState().
function applyKingdomNameFromPi(){
  if(!piUser || !piUser.username) return;
  state.kingdomName = piUser.username.length > 7
    ? piUser.username.slice(0,7)
    : piUser.username;
}

// Building Auras: one global soft glow applied to every occupied plot at
// once (not per-building-type — kept to a single equipped choice, same
// pattern as Badges/Frames/Effects, to avoid a second per-building-type
// purchase system on top of Skins). Rendered via a CSS custom property, not
// a per-color class, so adding more auras later never needs new CSS.
const BUILDING_AURAS = [
  { id:'gold',   name:'Golden Glow',  color:'#f0c878', gemPrice:30, goldPrice:90,  desc:'A warm glow around your buildings.' },
  { id:'silver', name:'Silver Glow',  color:'#cfd8e8', gemPrice:25, goldPrice:75,  desc:'A cool, soft glow.' },
  { id:'fire',   name:'Fire Glow',    color:'#ff8c42', gemPrice:35, goldPrice:105, desc:'A flickering orange glow.' },
  { id:'magic',  name:'Magic Glow',   color:'#b47cf0', gemPrice:40, goldPrice:120, desc:'A mysterious purple glow.' },
];
function findAura(id){
  return BUILDING_AURAS.find(a=>a.id===id) || null;
}
function buyAura(id, currency){
  const a = BUILDING_AURAS.find(x=>x.id===id);
  if(!a) return;
  state.ownedAuras = state.ownedAuras || [];
  if(state.ownedAuras.includes(id)) return;
  const price = currency==='gems' ? a.gemPrice : a.goldPrice;
  const label = currency==='gems' ? `💎${price}` : `🪙${price}`;
  if(currency==='gems'){
    if((state.gems||0) < a.gemPrice) return toast('Not enough gems');
  } else {
    if(state.gold < a.goldPrice) return toast('Not enough gold');
  }
  confirmAction({icon:'✨', title:`Buy ${a.name}`, desc:`Spend ${label} to unlock ${a.name}?`, confirmLabel:`${label} · Buy`, onConfirm: async ()=>{
    const ok = await buyCosmetic({ kind:'aura', itemId:id, currency });
    if(ok) toast(`${a.name} unlocked!`);
  }});
}
function equipAura(id){
  state.ownedAuras = state.ownedAuras || [];
  const owned = id==='none' || state.ownedAuras.includes(id);
  if(!owned) return;
  state.equippedAura = (id==='none') ? null : ((state.equippedAura===id) ? null : id);
  renderAll();
}

/* ============================= SOUND PACKS ============================= */
// Fully synthesized via Web Audio — no audio files. This app is a single
// self-contained HTML file with zero external assets (no images, no media,
// no CDN dependencies beyond the Pi SDK and webfonts), and shipping ~20
// recorded sound files across 4 packs would be the first thing to break
// that. Oscillators + filtered noise buffers get close enough for a light
// cosmetic touch, run instantly with no load time, and work offline.
let audioCtx = null;
function getAudioCtx(){
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if(!Ctx) return null;
  if(!audioCtx) audioCtx = new Ctx();
  // Browsers require a user gesture to start audio — every call site below
  // is inside a click handler (tile tap, buttons) except the treasure chest,
  // which fires from a setTimeout after finishPuzzle(); by then the context
  // was already created/resumed by the taps that solved the puzzle, so it's
  // already running once the chest's turn comes.
  if(audioCtx.state==='suspended') audioCtx.resume().catch(()=>{});
  return audioCtx;
}
function synthTone(ctx, {freq=440, freqEnd=null, type='sine', duration=.18, gain=.2, filterFreq=null, filterType='lowpass', detune=0, delay=0}={}){
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if(freqEnd) osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd,1), t0+duration);
  osc.detune.setValueAtTime(detune, t0);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0+.01);
  g.gain.exponentialRampToValueAtTime(.001, t0+duration);
  let out = osc;
  if(filterFreq){
    const f = ctx.createBiquadFilter();
    f.type = filterType;
    f.frequency.setValueAtTime(filterFreq, t0);
    out.connect(f); out = f;
  }
  out.connect(g).connect(ctx.destination);
  osc.start(t0); osc.stop(t0+duration+.02);
}
function synthNoise(ctx, {duration=.15, gain=.16, filterFreq=1000, filterType='bandpass', Q=1, delay=0}={}){
  const t0 = ctx.currentTime + delay;
  const size = Math.max(1, Math.floor(ctx.sampleRate*duration));
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for(let i=0;i<size;i++) data[i] = Math.random()*2-1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const f = ctx.createBiquadFilter();
  f.type = filterType;
  f.frequency.setValueAtTime(filterFreq, t0);
  f.Q.setValueAtTime(Q, t0);
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(.001, t0+duration);
  src.connect(f).connect(g).connect(ctx.destination);
  src.start(t0);
}
// DEFAULT_SOUND_PACK: free, always-owned, and equipped from the very first
// launch — the app should never be silent out of the box. The four packs
// below in SOUND_PACKS remain paid cosmetic alternatives; this one is the
// baseline everyone gets automatically. Kept separate from SOUND_PACKS so
// it can never accidentally be sold/priced, and so the shop can render it
// distinctly (no buy buttons, ever).
const DEFAULT_SOUND_PACK = {
  id:'default', name:'Default Sounds', free:true, desc:'Simple built-in tones — free, on from the start.',
  play(ctx, ev){
    if(ev==='tap') synthTone(ctx,{freq:700, type:'sine', duration:.05, gain:.22});
    else if(ev==='wrong') synthTone(ctx,{freq:220, type:'triangle', duration:.15, gain:.24});
    else if(ev==='solve'){ synthTone(ctx,{freq:523, type:'sine', duration:.16, gain:.26}); synthTone(ctx,{freq:784, type:'sine', duration:.18, gain:.2, delay:.06}); }
    else if(ev==='complete') [523,659,784,1047].forEach((f,i)=>synthTone(ctx,{freq:f, type:'sine', duration:.22, gain:.24, delay:i*.08}));
    else if(ev==='chest'){ synthTone(ctx,{freq:392, type:'triangle', duration:.2, gain:.26}); synthTone(ctx,{freq:523, type:'triangle', duration:.22, gain:.22, delay:.06}); }
  }
};
const SOUND_PACKS = [
  { id:'classic', name:'Classic Sounds', gemPrice:30, goldPrice:90, desc:'Warm, woody tones.',
    play(ctx, ev){
      if(ev==='tap') synthNoise(ctx,{duration:.05, gain:.16, filterFreq:1100, filterType:'bandpass', Q:2.5});
      else if(ev==='wrong') synthTone(ctx,{freq:180, type:'triangle', duration:.16, gain:.18});
      else if(ev==='solve'){ synthTone(ctx,{freq:523, type:'triangle', duration:.22, gain:.2}); synthTone(ctx,{freq:659, type:'triangle', duration:.22, gain:.14, delay:.05}); }
      else if(ev==='complete') [440,554,659,880].forEach((f,i)=>synthTone(ctx,{freq:f, type:'triangle', duration:.3, gain:.18, delay:i*.09}));
      else if(ev==='chest'){ synthNoise(ctx,{duration:.2, gain:.15, filterFreq:400, filterType:'lowpass'}); synthTone(ctx,{freq:150, type:'sine', duration:.25, gain:.2, delay:.05}); }
    }
  },
  { id:'electronic', name:'Electronic Sounds', gemPrice:40, goldPrice:120, desc:'Modern synth tones.',
    play(ctx, ev){
      if(ev==='tap') synthTone(ctx,{freq:900, type:'square', duration:.04, gain:.1});
      else if(ev==='wrong') synthTone(ctx,{freq:320, freqEnd:120, type:'sawtooth', duration:.18, gain:.15});
      else if(ev==='solve'){ synthTone(ctx,{freq:600, freqEnd:1000, type:'square', duration:.12, gain:.12}); synthTone(ctx,{freq:1200, type:'square', duration:.1, gain:.1, delay:.1}); }
      else if(ev==='complete') [523,659,784,1047].forEach((f,i)=>synthTone(ctx,{freq:f, type:'square', duration:.14, gain:.14, delay:i*.07}));
      else if(ev==='chest'){ synthNoise(ctx,{duration:.15, gain:.12, filterFreq:2500, filterType:'highpass'}); synthTone(ctx,{freq:200, freqEnd:800, type:'sawtooth', duration:.2, gain:.15, delay:.03}); }
    }
  },
  { id:'nature', name:'Nature Sounds', gemPrice:35, goldPrice:105, desc:'Water and wind textures.',
    play(ctx, ev){
      if(ev==='tap') synthNoise(ctx,{duration:.05, gain:.14, filterFreq:2400, filterType:'bandpass', Q:4});
      else if(ev==='wrong') synthNoise(ctx,{duration:.22, gain:.13, filterFreq:500, filterType:'lowpass'});
      else if(ev==='solve'){ synthNoise(ctx,{duration:.15, gain:.12, filterFreq:1800, filterType:'bandpass', Q:3}); synthTone(ctx,{freq:784, type:'sine', duration:.3, gain:.12, delay:.04}); }
      else if(ev==='complete'){ synthNoise(ctx,{duration:.9, gain:.1, filterFreq:700, filterType:'lowpass'}); [659,784,988].forEach((f,i)=>synthTone(ctx,{freq:f, type:'sine', duration:.4, gain:.12, delay:.1+i*.12})); }
      else if(ev==='chest'){ synthNoise(ctx,{duration:.35, gain:.16, filterFreq:1200, filterType:'bandpass', Q:1.5}); synthTone(ctx,{freq:220, type:'sine', duration:.3, gain:.14, delay:.05}); }
    }
  },
  { id:'epic', name:'Epic Sounds', gemPrice:50, goldPrice:150, desc:'Cinematic, film-score tones.',
    play(ctx, ev){
      if(ev==='tap') synthTone(ctx,{freq:100, type:'sine', duration:.05, gain:.16});
      else if(ev==='wrong') synthTone(ctx,{freq:130, type:'sawtooth', duration:.2, gain:.14, detune:-30});
      else if(ev==='solve'){ synthTone(ctx,{freq:220, type:'sawtooth', duration:.35, gain:.14}); synthTone(ctx,{freq:330, type:'sawtooth', duration:.35, gain:.1, delay:.03}); }
      else if(ev==='complete'){ [110,165,220,330].forEach((f,i)=>synthTone(ctx,{freq:f, type:'sawtooth', duration:.9, gain:.13, delay:i*.05})); synthNoise(ctx,{duration:.6, gain:.09, filterFreq:3000, filterType:'highpass', delay:.15}); }
      else if(ev==='chest'){ synthTone(ctx,{freq:90, type:'sine', duration:.4, gain:.22}); synthNoise(ctx,{duration:.5, gain:.12, filterFreq:2500, filterType:'highpass', delay:.05}); }
    }
  },
];
function findSoundPack(id){
  if(id==='default') return DEFAULT_SOUND_PACK;
  return SOUND_PACKS.find(p=>p.id===id) || null;
}
function buySoundPack(id, currency){
  const p = SOUND_PACKS.find(x=>x.id===id);
  if(!p) return;
  state.ownedSoundPacks = state.ownedSoundPacks || [];
  if(state.ownedSoundPacks.includes(id)) return;
  const price = currency==='gems' ? p.gemPrice : p.goldPrice;
  const label = currency==='gems' ? `💎${price}` : `🪙${price}`;
  if(currency==='gems'){
    if((state.gems||0) < p.gemPrice) return toast('Not enough gems');
  } else {
    if(state.gold < p.goldPrice) return toast('Not enough gold');
  }
  confirmAction({icon:'🔊', title:`Buy ${p.name}`, desc:`Spend ${label} to unlock ${p.name}?`, confirmLabel:`${label} · Buy`, onConfirm: async ()=>{
    const ok = await buyCosmetic({ kind:'soundpack', itemId:id, currency });
    if(ok) toast(`${p.name} unlocked!`);
  }});
}
function equipSoundPack(id){
  state.ownedSoundPacks = state.ownedSoundPacks || [];
  const owned = id==='none' || id==='default' || state.ownedSoundPacks.includes(id);
  if(!owned) return;
  state.equippedSoundPack = (id==='none') ? null : ((state.equippedSoundPack===id) ? null : id);
  renderAll();
}
function previewSoundPack(id){
  const p = findSoundPack(id);
  const ctx = getAudioCtx();
  if(!p || !ctx) return;
  p.play(ctx, 'solve');
}
function toggleSoundMute(){
  state.soundMuted = !state.soundMuted;
  renderAll();
}
// Central trigger point — called from tile taps, word solve/mistake, puzzle
// completion, and the treasure chest. A no-op (no AudioContext even touched)
// when muted or no pack is equipped.
function playSound(ev){
  if(state.soundMuted || !state.equippedSoundPack) return;
  const p = findSoundPack(state.equippedSoundPack);
  const ctx = getAudioCtx();
  if(!p || !ctx) return;
  try{ p.play(ctx, ev); }catch(e){ console.warn('Sound playback failed:', e); }
}

async function boot(){
  const loginBtn = document.getElementById('loginBtn');
  const landingNote = document.getElementById('landingNote');
  loginBtn.disabled = true;
  loginBtn.textContent = piInBrowser ? 'Signing in…' : 'Loading…';
  landingNote.textContent = piInBrowser ? '' : 'Not opened in the Pi Browser — continuing as a guest.';

  try{
    await initPi(); // resolves immediately outside the Pi Browser
    const remote = await loadRemote();
    const local = loadLocal();
    if(remote) state = remote;
    else if(local) state = local;
    applyKingdomNameFromPi();

    applyDailyStreak();
    applyAutoHarvest();
    // Retroactive catch-up: a returning player whose saved progress already
    // clears an achievement/collection threshold (e.g. pre-existing word
    // count) gets credited on next login rather than needing a fresh action
    // to trigger it.
    checkAchievementBadges();
    checkCollections();
    applyPendingGifts();

    document.getElementById('landingScreen').style.display = 'none';
    document.getElementById('appRoot').style.display = '';
    renderAll();
    saveState();
  }catch(e){
    console.error('Failed to enter the game:', e);
    landingNote.textContent = 'Something went wrong signing in — please try again.';
    loginBtn.disabled = false;
    loginBtn.textContent = 'Log In';
  }
}
document.getElementById('loginBtn').addEventListener('click', boot);
