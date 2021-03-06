
import java.io.*;
import java.net.URL;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import org.jsoup.*;
import org.jsoup.nodes.*;
import org.jsoup.select.Elements;

/**
 * Scrapes
 * Created by Tara on 6/8/2016.
 */
public class Scraper {

    /*
    TODO: Move from static methods into class-based?
    TODO: Fix gen-ed parsing for spring 2017
     */

    public static void main(String[] args) {
        //loadClassDescriptions();

        //*
        flushCRN();
        flushDist();
        //loadDetailedDescriptions(10001, 10900,"&TermDescription=Fall%202017");
        //loadDetailedDescriptions(30001, 31300,"&TermDescription=Spring%202017");
        //*/

        loadClassesNew("2018spring", "Spring 2018", true);


        /*
        loadClasses("2016spring", "Spring 2016");
        loadClasses("2016fall", "Fall 2016");
        //*/
        /*
        loadClasses("2017spring", "Spring 2017");
        loadClasses("2017fall", "Fall 2017");
        //*/
    }

    public static String getAutogenString(){
        DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        Date date = new Date();
        return "//File generated on "+dateFormat.format(date);
    }

    public static void flushCRN(){
        try{
            PrintWriter writer = new PrintWriter("data/crnData.js");
            writer.println(getAutogenString());
            writer.println("var descCRN = {};");
            writer.close();
        } catch(Exception e){
            System.err.println(e);
        }
    }
    public static void flushDist(){
        try{
            PrintWriter writer = new PrintWriter("data/distData.js");
            writer.println(getAutogenString());
            writer.println("var distData = {};");
            writer.close();
        } catch(Exception e){
            System.err.println(e);
        }
    }

    public static void loadDetailedDescriptions(int start, int end, String urlSuffix){
        String base="https://webapps.macalester.edu/utilities/scheduledetail/coursedetail.cfm?CRN=";
        try{

            PrintWriter crnWriter = new PrintWriter(new BufferedWriter(new FileWriter("data/crnData.js", true)));
            PrintWriter distWriter = new PrintWriter(new BufferedWriter(new FileWriter("data/distData.js", true)));
            for(int i=start; i<=end; i++){
                System.out.println(base+i+urlSuffix);
                URL url=new URL(base+i+urlSuffix);
                BufferedReader reader=new BufferedReader(new InputStreamReader(url.openStream()));

                String inputLine;
                boolean scanningDistr = false; // Scanning for distribution info
                while ((inputLine = reader.readLine()) != null) {
                    if(scanningDistr && inputLine.contains("<br />")) {
                        String dist = inputLine.substring(0, inputLine.indexOf("<br />"));
                        //System.out.println(dist);
                        distWriter.println("distData['"+i+urlSuffix+"'] = '" + dist + "';");
                    }
                    if(inputLine.contains("<br />") || inputLine.contains("</p>"))
                        scanningDistr = false;
                    if(inputLine.contains("Distribution")){
                        scanningDistr = true;
                    }

                    if(inputLine.contains("Notes")){
                        inputLine=inputLine.replaceAll("\'","\\\\'");
                        crnWriter.println("descCRN['"+i+urlSuffix+"'] = '"+inputLine+"';");
                    }

                }
                reader.close();

            }
            crnWriter.close();
            distWriter.close();
        } catch (Exception e){
            System.err.println(e);
        }
    }


    public static void loadClassDescriptions(){
        String baseAddress="http://www.macalester.edu/registrar/schedules/2016spring/class-schedule/";
        System.out.println("Loading spring 2016 class schedule page to fetch URLs...");
        ArrayList<String> deptURLs=new ArrayList<>();

        try {
            URL classScheduleURL = new URL(baseAddress);
            BufferedReader in = new BufferedReader(new InputStreamReader(classScheduleURL.openStream()));

            String inputLine;
            while ((inputLine = in.readLine()) != null) {
                if(inputLine.contains("class=\"more") && inputLine.contains("http")) {
                    int start=inputLine.indexOf("href")+6;
                    int end=inputLine.indexOf("class=")-2;
                    deptURLs.add(inputLine.substring(start, end)+"/courses");
                }
            }
            in.close();
        } catch (Exception e) {
            System.err.println("Department URL load failed!");
            System.err.println(e);
            return;
        }

        System.out.println("Done! Loading individual pages to parse descriptions...");
        HashMap<String, String> descMap=new HashMap<>();
        for(String url:deptURLs){
            int count=0;
            try{
                URL departmentURL=new URL(url);
                System.out.println("Loading "+url);
                BufferedReader in = new BufferedReader(new InputStreamReader(departmentURL.openStream()));

                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    if(inputLine.contains("h3") && inputLine.contains(" -")) {
                        //System.out.println("#"+inputLine);
                        int start=inputLine.indexOf("<h3>")+4;
                        int end=inputLine.indexOf(" -");
                        String title=inputLine.substring(start,end);
                        title=title.replaceAll(" ", "");

                        //System.out.println(title);
                        String desc=in.readLine()+in.readLine();
                        if(desc.contains("<p>")) {
                            while(!desc.contains("</p>"))
                                    desc+=in.readLine();
                            //System.out.println(desc);
                            start = desc.indexOf("<p>") + 3;
                            end = desc.indexOf("</p>");
                            //System.out.println("["+start+","+end+"]");
                            desc = desc.substring(start, end);
                            if (!descMap.containsKey(title)) {
                                descMap.put(title, desc);
                                count++;
                            }
                        }
                    }
                }
                in.close();
            } catch(Exception e){
                System.err.println("Department page load failed!");
                System.err.println(e);
                return;
            }
            if(count>0) {
                System.out.println("Page parsed successfully. " + count + " entries added.");
            } else{
                System.out.println("*Warning - No entries added*");
            }
        }

        try {
            PrintWriter writer = new PrintWriter("data/courseDescriptions.js", "UTF-8");
            writer.println(getAutogenString());
            writer.println("var descriptions = {};");
            for (String key : descMap.keySet()) {
                String desc=descMap.get(key);
                desc=desc.replaceAll("'","\\\\'");
                writer.println("descriptions['"+key+"'] = '"+desc+"';");
            }
            writer.close();
        } catch (Exception e){
            System.err.println("Failed writing file.");
            System.err.println(e);
            return;
        }
    }


    public static void loadClassesNew(String semester, String semesterText, boolean loadLocal){
        System.out.println("\nLoading Macalester class data for "+semester);
        //Address is the base semester address
        String address = "https://www.macalester.edu/registrar/schedules/"+semester+"/class-schedule/";
        Elements classes, descriptions;
        Document doc;
        try {
            if(loadLocal){
                File input = new File(semester+".html");
                doc = Jsoup.parse(input, "UTF-8", "");
            } else {
                System.out.println("Loading from "+address);
                doc = Jsoup.connect(address).get();
            }
            classes = doc.select(".class-schedule-course-number");
            descriptions=doc.select(".class-schedule-notes");
            System.out.println("Found "+classes.size()+" courses");
        } catch (IOException e) {
            System.err.println("Failed to retrieve page");
            e.printStackTrace();
            return;
        }
        System.out.println("Class Schedule page loaded. Parsing...");
        ArrayList<CourseListing> courses= new ArrayList<>();
        if(classes.size()!=descriptions.size()){
            System.err.println("Course listings and descriptions don't match 1:1!!!");
            return;
        }
        for(int i=0; i<classes.size(); i++){
            Element course, description;
            course=classes.get(i).parent();
            description=descriptions.get(i);
            courses.add(new CourseListing(course, description));
        }

        System.out.println("Data compiled. Printing to javascript file...");

        try {
            PrintWriter writer = new PrintWriter("data/courseData" +semester+ ".js", "UTF-8");

            writer.println(getAutogenString());

            writer.println("$(document).ready(function(){");
            writer.println("    var button='<button id=button"+semester+" onClick=load"+semester+"()>';");
            writer.println("    button+='"+semesterText+"';");
            writer.println("    button+='</button>';");
            writer.println("    $('#buttons').append(button); ");
            writer.println("});");

            writer.println("function load"+semester+"(){");
            //writer.println("    table.clear().draw();");
            writer.println("    table.destroy();");
            writer.println("    loadTable(courses"+semester+");");
            writer.println("    addDetails();");
            writer.println("    selectTable('"+semester+"')");
            writer.println("}");

            writer.println("var courses"+semester+" = [");
            for(int i=0; i<courses.size()-1; i++){
                writer.println(courses.get(i)+",");
            }
            writer.println(courses.get(courses.size()-1));
            writer.println("];");
            writer.close();
            System.out.println("Done!");

        } catch(Exception e){
            System.err.println("Write failed:");
            e.printStackTrace();
        }

        System.out.println("Done writing general data, now compiling class descriptions");

        try {
            PrintWriter crnWriter = new PrintWriter(new BufferedWriter(new FileWriter("data/crnData.js", true)));
            PrintWriter distWriter = new PrintWriter(new BufferedWriter(new FileWriter("data/distData.js", true)));
            for(Element description : descriptions){
               String crn = description.select(".expandable-body").first().id();
               String notes = "";
               if(description.children().first().is("p"))
                   notes += description.children().first().html()+"<br/>";
               notes+=description.select(".expandable-body p").first().ownText();
               notes=notes.replaceAll("\'","\\\\'");
               if(notes.length()>0){
                   String CRNLine = "descCRN['"+crn+"'] = 'Notes:<br/>"+notes+"';";
                   crnWriter.println(CRNLine);
               }
               String distr = description.select(".expandable-body p").get(2).ownText();
               if(distr.length()>0){
                   String distLine = "distData['"+crn+"'] = '"+distr+"';";
                   distWriter.println(distLine);
               }
            }
            crnWriter.close();
            distWriter.close();
        } catch (IOException e){
            e.printStackTrace();
        }
    }


    public static void loadClasses(String semester, String semesterText) {
        System.out.println("\nLoading Macalester class data for "+semester);

        //Address is the base semester address
        String address = "https://www.macalester.edu/registrar/schedules/"+semester+"/";

        ArrayList<String> scheduleLines=new ArrayList<>();

        System.out.println("Loading \""+address+"class-schedule/\"...");
        try {
            URL classScheduleURL = new URL(address+"class-schedule/");
            BufferedReader in = new BufferedReader(new InputStreamReader(classScheduleURL.openStream()));

            String inputLine;
            while ((inputLine = in.readLine()) != null)
                scheduleLines.add(inputLine);
            in.close();
        } catch (Exception e) {
            System.err.println("Class schedule load failed!");
            System.err.println(e);
            return;
        }
        System.out.println("Class Schedule page loaded. Parsing...");


        ArrayList<Integer> locations=new ArrayList<>();

        for(int i=0; i<scheduleLines.size(); i++){

            if(scheduleLines.get(i).contains("<tr class=")){
                if(scheduleLines.get(i+1).contains("white"))
                    locations.add(i);
            }
        }

        ArrayList<CourseListing> courses=new ArrayList<>();
        for(Integer index:locations){
            courses.add(new CourseListing(
                    scheduleLines.get(index+1), scheduleLines.get(index+2),
                    scheduleLines.get(index+3), scheduleLines.get(index+4),
                    scheduleLines.get(index+5), scheduleLines.get(index+6),
                    scheduleLines.get(index+7)));
        }

        System.out.println("Parsing complete.");
        System.out.println("Loading \""+address+"gened/\"...");

        ArrayList<String> genedLines=new ArrayList<>();
        try {
            URL genedURL = new URL(address+"gened/");
            BufferedReader in = new BufferedReader(new InputStreamReader(genedURL.openStream()));

            String inputLine;
            while ((inputLine = in.readLine()) != null)
                genedLines.add(inputLine);
            in.close();
        } catch (Exception e) {
            System.err.println(e);
            return;
        }

        int internat;
        int q1, q2, q3;
        int usID;
        int wA, wC, wP;

        System.out.println("Gen Ed page loaded. Parsing...");

        internat=find(genedLines, "<h3>Internationalism</h3>", 0, 0);
        q1=find(genedLines, "<strong>Q1</strong>", internat);
        q2=find(genedLines, "<strong>Q2</strong>", q1);
        q3=find(genedLines, "<strong>Q3</strong>", q2);
        usID=find(genedLines, "<h3>U.S. Identities and Differences</h3>", q3);
        wA=find(genedLines, "<strong>WA</strong>", usID);
        wC=find(genedLines, "<strong>WC</strong>", wA);
        wP=find(genedLines, "<strong>WP</strong>", wC);


        HashMap<String, Integer> internationalism = new HashMap<>();
        HashMap<String, Integer> quantitative = new HashMap<>();
        HashMap<String, Integer> usIdentity = new HashMap<>();
        HashMap<String, Integer> writingA = new HashMap<>();
        HashMap<String, Integer> writingC = new HashMap<>();
        HashMap<String, Integer> writingP = new HashMap<>();

        //Add internationalism to map
        ArrayList<String> result=getClasses(genedLines, internat, q1);
        for(String s:result){
            internationalism.put(s, 1);
        }

        //Add q1 to map
        result=getClasses(genedLines, q1, q2);
        for(String s:result){
            quantitative.put(s, 1);
        }
        //Add q2 to map
        result=getClasses(genedLines, q2, q3);
        for(String s:result){
            quantitative.put(s, 2);
        }
        //Add q3 to map
        result=getClasses(genedLines, q3, usID);
        for(String s:result){
            quantitative.put(s, 3);
        }

        //Add usID to map
        result=getClasses(genedLines, usID, wA);
        for(String s:result){
            usIdentity.put(s, 1);
        }

        //Add WA to map
        result=getClasses(genedLines, wA, wC);
        for(String s:result){
            writingA.put(s, 1);
        }
        //Add WC to map
        result=getClasses(genedLines, wC, wP);
        for(String s:result){
            writingC.put(s, 1);
        }
        //Add WP to map
        result=getClasses(genedLines, wP, genedLines.size());
        for(String s:result){
            writingP.put(s, 1);
        }

        System.out.println("Gen ed data loaded. Compiling...");

        for(CourseListing course:courses){
            String ID = course.getID();
            course.setInternationalism(internationalism.containsKey(ID));
            course.setUsID(usIdentity.containsKey(ID));
            course.setWa(writingA.containsKey(ID));
            course.setWc(writingC.containsKey(ID));
            course.setWp(writingP.containsKey(ID));
            if(quantitative.containsKey(ID))
                course.setQs(quantitative.get(ID));
        }

        System.out.println("Data compiled. Printing to javascript file...");

        try {
            PrintWriter writer = new PrintWriter("data/courseData" +semester+ ".js", "UTF-8");

            writer.println(getAutogenString());

            writer.println("$(document).ready(function(){");
            writer.println("    var button='<button id=button"+semester+" onClick=load"+semester+"()>';");
            writer.println("    button+='"+semesterText+"';");
            writer.println("    button+='</button>';");
            writer.println("    $('#buttons').append(button); ");
            writer.println("});");

            writer.println("function load"+semester+"(){");
            //writer.println("    table.clear().draw();");
            writer.println("    table.destroy();");
            writer.println("    loadTable(courses"+semester+");");
            writer.println("    addDetails();");
            writer.println("    selectTable('"+semester+"')");
            writer.println("}");

            writer.println("var courses"+semester+" = [");
            for(int i=0; i<courses.size()-1; i++){
                writer.println(courses.get(i)+",");
            }
            writer.println(courses.get(courses.size()-1));
            writer.println("];");
            writer.close();
            System.out.println("Done!");

        } catch(Exception e){
            System.err.println("Write failed:");
            e.printStackTrace();
        }

    }


    public static ArrayList<String> getClasses(ArrayList<String> lines, int start, int end){
        ArrayList<String> classes=new ArrayList<>();
        for(int i=start; i<end; i++){
            if(lines.get(i).contains("<span style=\"white-space:nowrap;\">")){
                int left=lines.get(i).indexOf("nowrap;\">")+9;
                int right=lines.get(i).indexOf("</span>");
                classes.add(lines.get(i).substring(left, right));
            }

        }
        return classes;
    }

    public static int find(ArrayList<String> lines, String target, int start){
        return find(lines, target, start, start);
    }

    public static int find(ArrayList<String> lines, String target, int start, int prev){
        for(int i=start; i<lines.size(); i++){
            if(lines.get(i).contains(target))
                return i;
        }
        return prev;
    }
}
